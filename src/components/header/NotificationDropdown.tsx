import { Bell } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import {useNotifications} from "@/layout/NotificationContext";

export function NotificationDropdown() {
  const notifications = useNotifications();
  const unread = notifications.filter(n => !n.isRead);

  return (
      <Popover>
        <PopoverTrigger>
          <div className="relative cursor-pointer">
            <Bell className="w-6 h-6" />
            {unread.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1.5">
              {unread.length}
            </span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 max-h-96 overflow-auto shadow-xl bg-white dark:bg-gray-900 rounded-md border">
          <div className="text-sm font-semibold mb-2">Notifications</div>
          {notifications.length === 0 ? (
              <p className="text-gray-400">No new notifications</p>
          ) : (
              <ul className="space-y-2">
                {notifications.map((n, i) => (
                    <li
                        key={i}
                        className="border px-3 py-2 rounded-md text-sm bg-white dark:bg-gray-800 shadow-sm"
                    >
                      <p className="font-medium">{n.title}</p>
                      <p className="text-gray-600 dark:text-gray-400">{n.message}</p>
                    </li>
                ))}
              </ul>
          )}
        </PopoverContent>
      </Popover>
  );
}
