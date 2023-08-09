<script lang="ts">
  import { getPomelloActionsContext } from '@/app/contexts/pomelloActionsContext';
  import { getPomelloStateContext } from '@/app/contexts/pomelloStateContext';
  import getCommandFormatter from '@/app/helpers/getCommandFormatter';
  import getTranslator from '@/app/helpers/getTranslator';
  import registerHotkeys from '@/app/helpers/registerHotkeys';
  import { getSettingsContext } from '@/shared/contexts/settingsContext';
  import { derived } from 'svelte/store';
  import Menu from './Menu.svelte';
  import MenuIcon from './assets/menu.svg?component';

  const { reset } = getPomelloActionsContext();
  const pomelloState = getPomelloStateContext();
  const settings = getSettingsContext();
  const translate = getTranslator();

  const appMode = derived(pomelloState, $pomelloState => $pomelloState.status);
  const formatCommand = getCommandFormatter($translate);

  let isMenuOpen = false;
  let menuElement: HTMLElement | undefined = undefined;
  let menuOffset: number = 0;

  $: menuTranslationKey = isMenuOpen ? 'closeMenuLabel' : 'openMenuLabel';

  const handleCreateTaskClick = () => {
    // TODO: Add create task
  };

  const handleMenuClick = () => {
    toggleMenu();
  };

  const handleHomeButtonClick = () => {
    routeHome();
  };

  const routeHome = async () => {
    const showCancelTaskDialog =
      $settings.warnBeforeTaskCancel &&
      $pomelloState.timer?.isActive &&
      $pomelloState.timer.type === 'TASK';

    if (showCancelTaskDialog) {
      const { response } = await window.app.showMessageBox({
        buttons: [$translate('cancelTaskDialogConfirm'), $translate('cancelTaskDialogCancel')],
        cancelId: 1,
        defaultId: 0,
        detail: $translate('cancelTaskDialogMessage'),
        message: $translate('cancelTaskDialogHeading'),
        title: 'Pomello',
        type: 'warning',
      });

      if (response === 1) {
        return;
      }
    }

    reset();

    isMenuOpen = false;
  };

  const toggleMenu = () => {
    if (menuElement) {
      menuOffset = menuElement.getBoundingClientRect().width;
    }

    isMenuOpen = !isMenuOpen;
  };

  registerHotkeys({
    toggleMenu,
    routeHome,
  });
</script>

<Menu
  bind:menuElement
  isOpen={isMenuOpen}
  on:createTask={handleCreateTaskClick}
  on:home={handleHomeButtonClick}
/>
<main
  class="container"
  data-mode={$appMode}
  style:transform={isMenuOpen && menuOffset ? `translate(${menuOffset}px)` : undefined}
>
  <button
    aria-label={$translate(menuTranslationKey)}
    class="menuButton"
    on:click={handleMenuClick}
    title={formatCommand('openMenuLabel', 'toggleMenu')}
  >
    <MenuIcon aria-hidden width={4} />
  </button>
  <div class="content">
    <slot />
  </div>
</main>

<style lang="scss">
  @import '../../../shared/styles/shared.scss';

  :global(body) {
    overflow: hidden;
    -webkit-app-region: drag;
    background-color: var(--menu-background);
  }

  :global(button) {
    -webkit-app-region: no-drag;
  }

  .container {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--app-background-default);
    color: var(--app-content-default);
    transition: transform 500ms $ease-out-circ;
    user-select: none;

    &[data-mode='TASK'] {
      background-color: var(--app-background-task);
      color: var(--app-content-task);
    }

    &[data-mode='SHORT_BREAK'] {
      background-color: var(--app-background-short-break);
      color: var(--app-content-short-break);
    }

    &[data-mode='LONG_BREAK'] {
      background-color: var(--app-background-long-break);
      color: var(--app-content-long-break);
    }
  }

  .menuButton {
    @extend %clickable;

    display: flex;
    width: 16px;
    height: 100vh;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    padding: 0;
    border: 0;
    background-color: var(--app-button-background-default);
    color: var(--menu-toggle-content-default);

    &:hover,
    &:focus {
      background-color: var(--app-button-background-hover);
      color: var(--menu-toggle-content-hover);
    }
  }

  .content {
    position: relative;
    overflow: hidden;
    height: 100vh;
    flex: 1;
  }
</style>
