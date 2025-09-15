"use client";

import { DEFAULT_ROLE_PERMISSIONS } from "@/lib/permissions";
import { Permission, UserRole } from "@/lib/types";
import { useState, useCallback } from "react";

export function usePermissions() {
  const [rolePermissions, setRolePermissions] = useState<
    Record<UserRole, Permission[]>
  >(DEFAULT_ROLE_PERMISSIONS);
  const [customPermissionLabels, setCustomPermissionLabels] = useState<
    Record<string, string>
  >({});
  const [loading, setLoading] = useState(false);
  const [tempPermissions, setTempPermissions] = useState<
    Record<UserRole, Permission[]>
  >(DEFAULT_ROLE_PERMISSIONS);

  const updateRolePermissions = useCallback(
    async (role: UserRole, permissions: Permission[]): Promise<void> => {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      setRolePermissions((prev) => {
        const updated = {
          ...prev,
          [role]: permissions,
        };
        setTempPermissions(updated);
        return updated;
      });

      setLoading(false);
    },
    []
  );

  const addPermissionToRole = useCallback(
    async (role: UserRole, permission: Permission): Promise<void> => {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setRolePermissions((prev) => {
        const updated = {
          ...prev,
          [role]: [...(prev[role] || []), permission].filter(
            (p, index, arr) => arr.indexOf(p) === index
          ),
        };
        setTempPermissions(updated);
        return updated;
      });

      setLoading(false);
    },
    []
  );

  const removePermissionFromRole = useCallback(
    async (role: UserRole, permission: Permission): Promise<void> => {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setRolePermissions((prev) => {
        const updated = {
          ...prev,
          [role]: (prev[role] || []).filter((p) => p !== permission),
        };
        setTempPermissions(updated);
        return updated;
      });

      setLoading(false);
    },
    []
  );

  const resetRolePermissions = useCallback(
    async (role: UserRole): Promise<void> => {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 600));

      setRolePermissions((prev) => {
        const updated = {
          ...prev,
          [role]: DEFAULT_ROLE_PERMISSIONS[role],
        };
        setTempPermissions(updated);
        return updated;
      });

      setLoading(false);
    },
    []
  );

  const addCustomPermission = useCallback(
    async (
      permissionKey: string,
      permissionLabel: string,
      selectedRoles: UserRole[] = [],
      applyToAllRoles = false
    ): Promise<void> => {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 600));

      const newPermission = permissionKey as Permission;

      setCustomPermissionLabels((prev) => ({
        ...prev,
        [permissionKey]: permissionLabel,
      }));

      setRolePermissions((prev) => {
        const updated = { ...prev };
        if (applyToAllRoles) {
          // Aplicar a todos os perfis existentes
          Object.keys(updated).forEach((role) => {
            if (!updated[role as UserRole].includes(newPermission)) {
              updated[role as UserRole] = [
                ...updated[role as UserRole],
                newPermission,
              ];
            }
          });
        } else if (selectedRoles.length > 0) {
          // Aplicar apenas aos perfis selecionados
          selectedRoles.forEach((role) => {
            if (!updated[role].includes(newPermission)) {
              updated[role] = [...updated[role], newPermission];
            }
          });
        }
        setTempPermissions(updated);
        return updated;
      });

      setLoading(false);
    },
    []
  );

  const removeCustomPermission = useCallback(
    async (permission: Permission): Promise<void> => {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 600));

      setCustomPermissionLabels((prev) => {
        const updated = { ...prev };
        delete updated[permission];
        return updated;
      });

      setRolePermissions((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((role) => {
          updated[role as UserRole] = updated[role as UserRole].filter(
            (p) => p !== permission
          );
        });
        setTempPermissions(updated);
        return updated;
      });

      setLoading(false);
    },
    []
  );

  const isCustomPermission = useCallback((permission: Permission): boolean => {
    const defaultPermissions = Object.values(DEFAULT_ROLE_PERMISSIONS).flat();
    return !defaultPermissions.includes(permission);
  }, []);

  const getAllAvailablePermissions = useCallback((): Permission[] => {
    const defaultPermissions = Object.keys(DEFAULT_ROLE_PERMISSIONS).reduce(
      (acc, role) => {
        DEFAULT_ROLE_PERMISSIONS[role as UserRole].forEach((perm) => {
          if (!acc.includes(perm)) acc.push(perm);
        });
        return acc;
      },
      [] as Permission[]
    );

    const allCurrentPermissions = Object.values(rolePermissions).flat();
    allCurrentPermissions.forEach((perm) => {
      if (!defaultPermissions.includes(perm)) {
        defaultPermissions.push(perm);
      }
    });

    return defaultPermissions;
  }, [rolePermissions]);

  const hasPermission = useCallback(
    (role: UserRole, permission: Permission): boolean => {
      return rolePermissions[role]?.includes(permission) || false;
    },
    [rolePermissions]
  );

  const getPermissionLabel = useCallback(
    (permission: Permission): string => {
      return (
        PERMISSION_LABELS[permission] ||
        customPermissionLabels[permission] ||
        permission
      );
    },
    [customPermissionLabels]
  );

  return {
    rolePermissions,
    tempPermissions,
    loading,
    updateRolePermissions,
    addPermissionToRole,
    removePermissionFromRole,
    resetRolePermissions,
    hasPermission,
    addCustomPermission,
    removeCustomPermission,
    getAllAvailablePermissions,
    isCustomPermission,
    getPermissionLabel,
  };
}
