import {FriendRequestStatus} from "@prisma/client";
import {ApiError} from "@/lib/api/errors";
import {prisma} from "@/lib/prisma";

type SendFriendRequestInput = {
  senderUsername: string;
  targetUsername: string;
};

type HandleFriendRequestInput = {
  requestId: string;
  username: string;
  action: "accept" | "reject";
};

function sortUserIds(firstId: string, secondId: string) {
  return firstId < secondId ? [firstId, secondId] : [secondId, firstId];
}

export async function listFriendsByUsername(username: string) {
  const currentUser = await prisma.user.findUnique({
    where: {username},
    select: {id: true},
  });

  if (!currentUser) {
    throw new ApiError("User nicht gefunden.", 404);
  }

  const friendships = await prisma.friendship.findMany({
    where: {
      OR: [{userAId: currentUser.id}, {userBId: currentUser.id}],
    },
    include: {
      userA: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          createdAt: true,
        },
      },
      userB: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          createdAt: true,
        },
      },
    },
    orderBy: {createdAt: "desc"},
  });

  return friendships.map((friendship) =>
    friendship.userA.id === currentUser.id ? friendship.userB : friendship.userA,
  );
}

export async function listIncomingRequests(username: string) {
  const currentUser = await prisma.user.findUnique({
    where: {username},
    select: {id: true},
  });

  if (!currentUser) {
    throw new ApiError("User nicht gefunden.", 404);
  }

  return prisma.friendRequest.findMany({
    where: {
      receiverId: currentUser.id,
      status: FriendRequestStatus.PENDING,
    },
    include: {
      sender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
        },
      },
    },
    orderBy: {createdAt: "desc"},
  });
}

export async function sendFriendRequest(input: SendFriendRequestInput) {
  const senderUsername = input.senderUsername.trim().toLowerCase();
  const targetUsername = input.targetUsername.trim().toLowerCase();

  if (senderUsername === targetUsername) {
    throw new ApiError("Du kannst dich nicht selbst hinzufügen.", 400);
  }

  const [sender, receiver] = await Promise.all([
    prisma.user.findUnique({where: {username: senderUsername}, select: {id: true}}),
    prisma.user.findUnique({where: {username: targetUsername}, select: {id: true}}),
  ]);

  if (!sender) {
    throw new ApiError("Absender wurde nicht gefunden.", 404);
  }

  if (!receiver) {
    throw new ApiError("Der angegebene Username existiert nicht.", 404);
  }

  const [userAId, userBId] = sortUserIds(sender.id, receiver.id);

  const friendship = await prisma.friendship.findUnique({
    where: {userAId_userBId: {userAId, userBId}},
    select: {id: true},
  });

  if (friendship) {
    throw new ApiError("Ihr seid bereits befreundet.", 409);
  }

  const reversePending = await prisma.friendRequest.findUnique({
    where: {
      senderId_receiverId: {
        senderId: receiver.id,
        receiverId: sender.id,
      },
    },
  });

  if (reversePending?.status === FriendRequestStatus.PENDING) {
    throw new ApiError("Diese Person hat dir bereits eine Anfrage geschickt.", 409);
  }

  const existing = await prisma.friendRequest.findUnique({
    where: {
      senderId_receiverId: {
        senderId: sender.id,
        receiverId: receiver.id,
      },
    },
  });

  if (existing?.status === FriendRequestStatus.PENDING) {
    throw new ApiError("Anfrage wurde bereits gesendet.", 409);
  }

  if (existing) {
    return prisma.friendRequest.update({
      where: {id: existing.id},
      data: {
        status: FriendRequestStatus.PENDING,
        respondedAt: null,
      },
      select: {id: true, createdAt: true},
    });
  }

  return prisma.friendRequest.create({
    data: {
      senderId: sender.id,
      receiverId: receiver.id,
    },
    select: {id: true, createdAt: true},
  });
}

export async function handleFriendRequest(input: HandleFriendRequestInput) {
  const username = input.username.trim().toLowerCase();

  const currentUser = await prisma.user.findUnique({
    where: {username},
    select: {id: true},
  });

  if (!currentUser) {
    throw new ApiError("User nicht gefunden.", 404);
  }

  const request = await prisma.friendRequest.findUnique({
    where: {id: input.requestId},
  });

  if (!request || request.receiverId !== currentUser.id) {
    throw new ApiError("Anfrage nicht gefunden.", 404);
  }

  if (request.status !== FriendRequestStatus.PENDING) {
    throw new ApiError("Diese Anfrage wurde bereits bearbeitet.", 409);
  }

  if (input.action === "reject") {
    await prisma.friendRequest.update({
      where: {id: request.id},
      data: {
        status: FriendRequestStatus.REJECTED,
        respondedAt: new Date(),
      },
    });

    return;
  }

  const [userAId, userBId] = sortUserIds(request.senderId, request.receiverId);

  await prisma.$transaction(async (tx) => {
    await tx.friendRequest.update({
      where: {id: request.id},
      data: {
        status: FriendRequestStatus.ACCEPTED,
        respondedAt: new Date(),
      },
    });

    await tx.friendship.upsert({
      where: {
        userAId_userBId: {
          userAId,
          userBId,
        },
      },
      update: {},
      create: {
        userAId,
        userBId,
      },
    });
  });
}
