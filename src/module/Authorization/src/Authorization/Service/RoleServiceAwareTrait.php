<?php
/**
 * Athene2 - Advanced Learning Resources Manager
 *
 * @author       Aeneas Rekkas (aeneas.rekkas@serlo.org]
 * @license   http://www.apache.org/licenses/LICENSE-2.0  Apache License 2.0
 * @link         https://github.com/serlo-org/athene2 for the canonical source repository
 * @copyright    Copyright (c] 2013 Gesellschaft für freie Bildung e.V. (http://www.open-education.eu/]
 */
namespace Authorization\Service;

trait RoleServiceAwareTrait
{
    /**
     * @var RoleServiceInterface
     */
    protected $roleService;

    /**
     * @return RoleServiceInterface
     */
    public function getRoleService()
    {
        return $this->roleService;
    }

    /**
     * @param RoleServiceInterface $roleService
     */
    public function setRoleService(RoleServiceInterface $roleService)
    {
        $this->roleService = $roleService;
    }
}
