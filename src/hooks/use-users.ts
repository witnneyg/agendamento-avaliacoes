"use client";

import { useState, useCallback } from "react";

export function useUsers() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);

  const addUser = useCallback(async (userData: UserFormData): Promise<User> => {
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setUsers((prev) => [...prev, newUser]);
    setLoading(false);

    return newUser;
  }, []);

  const updateUser = useCallback(
    async (id: string, userData: Partial<UserFormData>): Promise<User> => {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      setUsers((prev) =>
        prev.map((user) =>
          user.id === id
            ? { ...user, ...userData, updatedAt: new Date() }
            : user
        )
      );

      const updatedUser = users.find((user) => user.id === id);
      setLoading(false);

      if (!updatedUser) {
        throw new Error("Usuário não encontrado");
      }

      return { ...updatedUser, ...userData, updatedAt: new Date() };
    },
    [users]
  );

  const toggleUserStatus = useCallback(async (id: string): Promise<void> => {
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    setUsers((prev) =>
      prev.map((user) =>
        user.id === id
          ? { ...user, isActive: !user.isActive, updatedAt: new Date() }
          : user
      )
    );

    setLoading(false);
  }, []);

  const deleteUser = useCallback(async (id: string): Promise<void> => {
    setLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 600));

    setUsers((prev) => prev.filter((user) => user.id !== id));
    setLoading(false);
  }, []);

  const getUsersByRole = useCallback(
    (role: UserRole): User[] => {
      return users.filter((user) => user.role === role);
    },
    [users]
  );

  const getActiveUsers = useCallback((): User[] => {
    return users.filter((user) => user.isActive);
  }, [users]);

  return {
    users,
    loading,
    addUser,
    updateUser,
    toggleUserStatus,
    deleteUser,
    getUsersByRole,
    getActiveUsers,
  };
}
