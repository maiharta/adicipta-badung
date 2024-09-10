import { UserGroupLoginLog } from "@/lib/definitions";
import { getFormattedTime } from "@/lib/utils";

export const LoginLogs = ({
  userGroupLoginLogs,
}: {
  userGroupLoginLogs: UserGroupLoginLog[];
}) => {
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {userGroupLoginLogs.map((loginLog, i) => (
        <span key={i} className="text-xs font-semibold">
          {loginLog.user.username}
          <span className="font-normal">
            ({getFormattedTime(loginLog.lastDate)})
          </span>
          {loginLog.count}x{userGroupLoginLogs.length - 1 > i ? "," : ""}
        </span>
      ))}
    </div>
  );
};
