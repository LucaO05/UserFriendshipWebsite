"use client";

import {useEffect, useState} from "react";
import {useParams, useRouter} from "next/navigation";
import {useTranslations} from "next-intl";
import {HomeBackground} from "@/components/home";
import {AddFriendForm} from "@/components/dashboard/AddFriendForm";
import {FriendsAccordion} from "@/components/dashboard/FriendsAccordion";
import {GuestState} from "@/components/dashboard/GuestState";
import {RequestsPanel} from "@/components/dashboard/RequestsPanel";
import {SettingsModal} from "@/components/dashboard/SettingsModal";
import {getStoredUser} from "@/components/dashboard/helpers";
import type {
  Friend,
  FriendsResponse,
  IncomingRequest,
  IncomingRequestsResponse,
  SendRequestResponse,
  StoredUser,
} from "@/components/dashboard/types";

export function DashboardView() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<IncomingRequest[]>([]);
  const [isFriendsOpen, setIsFriendsOpen] = useState(true);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [isFriendsLoading, setIsFriendsLoading] = useState(false);
  const [isRequestsLoading, setIsRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [isSubmittingRequestId, setIsSubmittingRequestId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const t = useTranslations("dashboard");
  const params = useParams<{locale: string}>();
  const router = useRouter();

  const locale = params.locale ?? "de";

  useEffect(() => {
    setUser(getStoredUser());
    setHasHydrated(true);
  }, []);

  const loadFriends = async (currentUsername: string) => {
    setIsFriendsLoading(true);

    try {
      const response = await fetch(`/api/friends?username=${encodeURIComponent(currentUsername)}`);
      const data: FriendsResponse = await response.json();

      if (!response.ok || !data.success || !Array.isArray(data.friends)) {
        setFriends([]);
        return;
      }

      setFriends(data.friends);
    } catch {
      setFriends([]);
    } finally {
      setIsFriendsLoading(false);
    }
  };

  const loadRequests = async (currentUsername: string) => {
    setIsRequestsLoading(true);
    setRequestsError(null);

    try {
      const response = await fetch(
        `/api/friends/requests?username=${encodeURIComponent(currentUsername)}`,
      );
      const data: IncomingRequestsResponse = await response.json();

      if (!response.ok || !data.success || !Array.isArray(data.requests)) {
        setRequestsError(t("requestsLoadError"));
        setIncomingRequests([]);
        return;
      }

      setIncomingRequests(data.requests);
    } catch {
      setRequestsError(t("requestsLoadError"));
      setIncomingRequests([]);
    } finally {
      setIsRequestsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    void loadFriends(user.username);
    void loadRequests(user.username);
  }, [user?.id, user?.username]);

  if (!hasHydrated) {
    return (
      <HomeBackground>
        <div className="w-full max-w-xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 text-center">
            <p className="text-slate-300">{t("loading")}</p>
          </div>
        </div>
      </HomeBackground>
    );
  }

  if (!user) {
    return <GuestState locale={locale} />;
  }

  const handleRequestAction = async (requestId: string, action: "accept" | "reject") => {
    setIsSubmittingRequestId(requestId);
    setRequestsError(null);

    try {
      const response = await fetch("/api/friends/requests", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          username: user.username,
          action,
        }),
      });

      const data: SendRequestResponse = await response.json();

      if (!response.ok || !data.success) {
        setRequestsError(data.message || t("requestActionError"));
        return;
      }

      await Promise.all([loadFriends(user.username), loadRequests(user.username)]);
    } catch {
      setRequestsError(t("requestActionError"));
    } finally {
      setIsSubmittingRequestId(null);
    }
  };

  return (
    <HomeBackground>
      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-8 relative">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xl font-semibold text-white">{user.username}</p>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-900/60 border border-slate-700 text-slate-200 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label={t("settings")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
              <p className="text-slate-400 text-sm">{t("friendsCount")}</p>
              <p className="text-3xl font-bold text-white">{friends.length}</p>
            </div>
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
              <p className="text-amber-100 text-sm">{t("pendingCount")}</p>
              <p className="text-3xl font-bold text-amber-100">{isRequestsLoading ? "..." : incomingRequests.length}</p>
              <button
                type="button"
                onClick={() => setIsRequestsOpen((value) => !value)}
                className="mt-3 text-sm text-amber-100/90 underline hover:text-amber-50"
              >
                {isRequestsOpen ? t("hideRequests") : t("showRequests")}
              </button>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <AddFriendForm
              currentUsername={user.username}
              onRequestSent={() => {
                void loadRequests(user.username);
              }}
            />

            {isRequestsOpen && (
              <RequestsPanel
                requests={incomingRequests}
                isLoading={isRequestsLoading}
                error={requestsError}
                onAccept={(requestId) => {
                  void handleRequestAction(requestId, "accept");
                }}
                onReject={(requestId) => {
                  void handleRequestAction(requestId, "reject");
                }}
                isSubmittingRequestId={isSubmittingRequestId}
              />
            )}

            <FriendsAccordion
              friends={friends}
              isFriendsOpen={isFriendsOpen}
              isFriendsLoading={isFriendsLoading}
              friendsError={null}
              onToggle={() => setIsFriendsOpen((value) => !value)}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("auth_user");
              router.push(`/${locale}`);
            }}
            className="inline-flex px-5 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
          >
            {t("logout")}
          </button>
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        user={user}
        onClose={() => setIsSettingsOpen(false)}
        onUserUpdated={(updatedUser) => {
          setUser(updatedUser);
          localStorage.setItem("auth_user", JSON.stringify(updatedUser));
        }}
      />
    </HomeBackground>
  );
}
