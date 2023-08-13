<script lang="ts">
  import getTranslator from '@/app/helpers/getTranslator';
  import { createEventDispatcher } from 'svelte';
  import AddIcon from './assets/add.svg?component';
  import CogIcon from './assets/cog.svg?component';
  import HomeIcon from './assets/home.svg?component';

  export let menuElement: HTMLElement | undefined = undefined;
  export let isOpen: boolean;

  const dispatch = createEventDispatcher<{
    createTask: void;
    home: void;
  }>();

  const translate = getTranslator();

  const handleHomeClick = () => {
    dispatch('home');
  };

  const handleCreateTaskClick = () => {
    dispatch('createTask');
  };
</script>

<nav aria-label={translate('menuLabel')} bind:this={menuElement} class="menu">
  <button
    aria-hidden={!isOpen}
    aria-label={translate('homeButtonLabel')}
    class="button"
    on:click={handleHomeClick}
    tabIndex={isOpen ? 0 : -1}
  >
    <HomeIcon aria-hidden />
  </button>
  <button
    aria-label={translate('dashboardButtonLabel')}
    aria-hidden={!isOpen}
    class="button"
    tabIndex={isOpen ? 0 : -1}
  >
    <CogIcon aria-hidden />
  </button>
  <button
    aria-hidden={!isOpen}
    aria-label={translate('createTaskButtonLabel')}
    class="button"
    on:click={handleCreateTaskClick}
    tabIndex={isOpen ? 0 : -1}
  >
    <AddIcon aria-hidden />
  </button>
</nav>

<style lang="scss">
  .menu {
    position: absolute;
    display: flex;
    height: 100%;
    align-items: center;
    padding: 0 8px;
  }

  .button {
    display: flex;
    width: 36px;
    height: 36px;
    align-items: center;
    justify-content: center;
    border: 0;
    border-radius: 50%;
    background-color: var(--menu-button-background-default);
    color: var(--menu-button-content-default);

    &:hover,
    &:focus {
      background-color: var(--menu-button-background-hover);
      color: var(--menu-button-content-hover);
    }

    :global(svg) {
      width: 20px;
    }
  }
</style>
