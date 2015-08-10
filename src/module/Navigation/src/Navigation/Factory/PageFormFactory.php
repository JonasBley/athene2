<?php
/**
 * Athene2 - Advanced Learning Resources Manager
 *
 * @author    Aeneas Rekkas (aeneas.rekkas@serlo.org)
 * @license   http://www.apache.org/licenses/LICENSE-2.0  Apache License 2.0
 * @link      https://github.com/serlo-org/athene2 for the canonical source repository
 * @copyright Copyright (c) 2013-2014 Gesellschaft für freie Bildung e.V. (http://www.open-education.eu/)
 */
namespace Navigation\Factory;

use Common\Factory\EntityManagerFactoryTrait;
use Navigation\Form\PageForm;
use Zend\ServiceManager\FactoryInterface;
use Zend\ServiceManager\ServiceLocatorInterface;

class PageFormFactory implements FactoryInterface
{
    use EntityManagerFactoryTrait;

    /**
     * Create service
     *
     * @param ServiceLocatorInterface $serviceLocator
     * @return ContainerForm
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $entityManager = $this->getEntityManager($serviceLocator);
        $form          = new PageForm($entityManager);

        return $form;
    }
}
