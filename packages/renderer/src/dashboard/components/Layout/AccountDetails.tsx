import { usePomelloConfig, useTranslate } from '@/shared/context/RuntimeContext';
import { ActionsMenu } from '@/ui/dashboard/ActionsMenu';
import { DashboardRoute, PomelloUser } from '@pomello-desktop/domain';
import { useMatch, useNavigate } from '@solidjs/router';
import { Component } from 'solid-js';
import styles from './AccountDetails.module.scss';

type AccountDetailsProps = {
  user: PomelloUser;
};

export const AccountDetails: Component<AccountDetailsProps> = props => {
  const getMatchedProfileRoute = useMatch(() => DashboardRoute.Profile);
  const navigate = useNavigate();
  const pomelloConfig = usePomelloConfig();
  const t = useTranslate();

  const handleEditProfileClick = () => {
    navigate(DashboardRoute.Profile);
  };

  const handleLogOutClick = () => {
    if (getMatchedProfileRoute()) {
      navigate(DashboardRoute.Productivity);
    }

    pomelloConfig.actions.userInvalidated();
  };

  const accountActions = [
    {
      content: t('accountDetailsEditProfile'),
      onClick: handleEditProfileClick,
    },
    {
      content: t('accountDetailsLogOut'),
      onClick: handleLogOutClick,
    },
  ];

  return (
    <div class={styles.accountDetails}>
      <div class={styles.user}>
        <span class={styles.badge} data-type={props.user.type}>
          {t(`${props.user.type}AccountLabel`)}
        </span>
        <p class={styles.userDetail}>{props.user.name}</p>
        <p class={styles.userDetail}>{props.user.email}</p>
      </div>
      <ActionsMenu
        actions={accountActions}
        menuLabel={t('accountActionsMenuLabel')}
        tooltip={t('accountActionsTooltip')}
        triggerLabel={t('accountActionsTriggerLabel')}
      />
    </div>
  );
};
