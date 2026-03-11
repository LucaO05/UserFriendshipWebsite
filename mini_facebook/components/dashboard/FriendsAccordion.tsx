import {useTranslations} from "next-intl";
import type {Friend} from "@/components/dashboard/types";

type FriendsAccordionProps = {
  friends: Friend[];
  isFriendsOpen: boolean;
  isFriendsLoading: boolean;
  friendsError: string | null;
  onToggle: () => void;
};

export function FriendsAccordion({
  friends,
  isFriendsOpen,
  isFriendsLoading,
  friendsError,
  onToggle,
}: FriendsAccordionProps) {
  const t = useTranslations("dashboard");

  return (
    <div className="bg-slate-900/40 border border-slate-700/80 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-white hover:bg-slate-800/60 transition-colors"
      >
        <span className="font-semibold">
          {t("friendsTitle")} ({friends.length})
        </span>
        <span className="text-slate-300">{isFriendsOpen ? t("collapse") : t("expand")}</span>
      </button>

      {isFriendsOpen && (
        <div className="px-5 pb-5">
          {isFriendsLoading && <p className="text-slate-300">{t("friendsLoading")}</p>}
          {friendsError && <p className="text-red-300">{friendsError}</p>}
          {!isFriendsLoading && !friendsError && friends.length === 0 && (
            <p className="text-slate-300">{t("friendsEmpty")}</p>
          )}
          {!isFriendsLoading && !friendsError && friends.length > 0 && (
            <div className="space-y-3">
              {friends.map((friend) => (
                <div key={friend.id} className="rounded-lg border border-slate-700 bg-slate-800/60 px-4 py-3">
                  <p className="font-semibold text-white">
                    {friend.firstName} {friend.lastName}
                  </p>
                  <p className="text-sm text-slate-300">{friend.username}</p>
                  <p className="text-xs text-slate-400">{friend.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
