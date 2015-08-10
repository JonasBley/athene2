<?php
/**
 * Athene2 - Advanced Learning Resources Manager
 *
 * @author    Aeneas Rekkas (aeneas.rekkas@serlo.org)
 * @license   http://www.apache.org/licenses/LICENSE-2.0  Apache License 2.0
 * @link      https://github.com/serlo-org/athene2 for the canonical source repository
 * @copyright Copyright (c) 2013-2014 Gesellschaft für freie Bildung e.V. (http://www.open-education.eu/)
 */
namespace Mailman\Factory;

use Mailman\Listener\NotificationWorkerListener;
use Zend\ServiceManager\ServiceLocatorInterface;
use Zend\ServiceManager\FactoryInterface;

class NotificationWorkerListenerFactory implements FactoryInterface
{
    /**
     * Create service
     *
     * @param ServiceLocatorInterface $serviceLocator
     * @return mixed
     */
    public function createService(ServiceLocatorInterface $serviceLocator)
    {
        $mailman    = $serviceLocator->get('Mailman/Mailman');
        $translator = $serviceLocator->get('Translator');
        $logger     = $serviceLocator->get('Zend\Log\Logger');
        $renderer   = $serviceLocator->get('ZfcTwigRenderer');
        $class      = new NotificationWorkerListener($logger, $mailman, $renderer, $translator);

        return $class;
    }
}
