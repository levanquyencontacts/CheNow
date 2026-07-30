"use client";

import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "@/services/apiServices";
import type { RootState } from "@/services/store";
import type { AccountRoleCode, AuthUser } from "@/services/types/apiType";

const roleLabels: Record<AccountRoleCode, string> = {
  admin: "Admin",
  staff: "Staff",
  customer: "Customer",
};

export default function AccountsPage() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.user.getAdminUsers({
        limit: 100,
        searchValue,
      });
      setUsers(response.data);
    } catch {
      setError("Không thể tải danh sách tài khoản.");
    } finally {
      setLoading(false);
    }
  }, [searchValue]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void loadUsers();
    }, 250);

    return () => window.clearTimeout(timerId);
  }, [loadUsers]);

  const changeRole = async (user: AuthUser, roleCode: AccountRoleCode) => {
    if (
      user.role.code === roleCode ||
      !window.confirm(
        `Đổi vai trò của ${user.email} từ ${roleLabels[user.role.code]} sang ${roleLabels[roleCode]}?`,
      )
    ) {
      return;
    }

    setError("");
    try {
      await api.user.changeRole(user.id, roleCode);
      await loadUsers();
    } catch {
      setError(
        "Không thể đổi vai trò. Kiểm tra quy tắc admin cuối cùng hoặc thử lại.",
      );
    }
  };

  return (
    <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#b57936]">
              Administration
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#143d2a]">
              Quản lý tài khoản
            </h1>
          </div>
          <input
            className="w-full rounded-lg border border-[#decbb8] bg-white px-3 py-2 text-sm outline-none focus:border-[#d17345] sm:w-72"
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Tìm theo email hoặc tên"
            value={searchValue}
          />
        </div>

        {error ? (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <div className="overflow-x-auto rounded-xl border border-[#ead8c6] bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-[#fff4e9] text-xs uppercase text-[#6f5b4a]">
              <tr>
                <th className="px-4 py-3">Tài khoản</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Vai trò hiện tại</th>
                <th className="px-4 py-3">Đổi vai trò</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0e4d8]">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#143d2a]">
                      {user.fullName || "Chưa cập nhật tên"}
                    </p>
                    <p className="text-xs text-[#7a695b]">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    {user.isActive ? "Đang hoạt động" : "Tạm khóa"}
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    {roleLabels[user.role.code]}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      className="rounded-md border border-[#decbb8] bg-white px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                      disabled={user.id === currentUser?.id}
                      onChange={(event) =>
                        void changeRole(
                          user,
                          event.target.value as AccountRoleCode,
                        )
                      }
                      value={user.role.code}
                    >
                      {Object.entries(roleLabels).map(([code, label]) => (
                        <option key={code} value={code}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !users.length ? (
            <p className="p-8 text-center text-sm text-[#7a695b]">
              Không tìm thấy tài khoản.
            </p>
          ) : null}
          {loading ? (
            <p className="p-8 text-center text-sm text-[#7a695b]">
              Đang tải...
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
