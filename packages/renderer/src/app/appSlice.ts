import { DialAction, NoteType, Settings } from '@domain';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';
import { PomelloState } from '@tinynudge/pomello-service';
import { RootState } from './createStore';

type OverlayView = 'create-task' | NoteType;

interface AppState {
  dialActions: DialAction[];
  isQuickTaskSelectEnabled: boolean;
  overlayView: OverlayView | null;
  pomelloState: PomelloState;
  serviceId?: string;
  settings: Settings;
}

const initialState: AppState = {
  dialActions: [],
  isQuickTaskSelectEnabled: false,
  overlayView: null,
  pomelloState: null as unknown as PomelloState,
  settings: null as unknown as Settings,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    dialActionsSet: (state, { payload }: PayloadAction<DialAction[]>) => {
      state.dialActions = payload;
    },
    dialActionsUnset: state => {
      state.dialActions = [];
    },
    pomelloStateUpdate: (state, { payload }: PayloadAction<PomelloState>) => {
      state.pomelloState = payload;
    },
    quickTaskSelectDisabled: state => {
      state.isQuickTaskSelectEnabled = false;
    },
    quickTaskSelectEnabled: state => {
      state.isQuickTaskSelectEnabled = true;
    },
    serviceChange: (state, { payload }: PayloadAction<string | undefined>) => {
      state.serviceId = payload;
    },
    settingsChange: (state, { payload }: PayloadAction<Settings>) => {
      state.settings = payload;
    },
    setOverlayView: (state, { payload }: PayloadAction<OverlayView>) => {
      state.overlayView = payload;
    },
    unsetOverlayView: state => {
      state.overlayView = null;
    },
  },
});

export const {
  dialActionsSet,
  dialActionsUnset,
  pomelloStateUpdate,
  quickTaskSelectDisabled,
  quickTaskSelectEnabled,
  serviceChange,
  setOverlayView,
  settingsChange,
  unsetOverlayView,
} = appSlice.actions;

const selectAppState = (state: RootState): AppState => state.app;

export const selectAppMode = ({ app }: RootState) =>
  app.pomelloState.timer?.isActive ? app.pomelloState.timer.type : undefined;

export const selectCurrentTaskId = ({ app }: RootState) => app.pomelloState.currentTaskId;

export const selectDialActions = createSelector(selectAppState, app => app.dialActions);

export const selectIsOvertimeVisible = ({ app }: RootState) => Boolean(app.pomelloState.overtime);

export const selectIsQuickTaskSelectEnabled = ({ app }: RootState) =>
  Boolean(app.isQuickTaskSelectEnabled);

export const selectIsTimerActive = ({ app }: RootState) =>
  Boolean(app.pomelloState.timer?.isActive);

export const selectIsTimerVisible = ({ app }: RootState) => Boolean(app.pomelloState.timer);

export const selectOverlayView = ({ app }: RootState) => app.overlayView;

export const selectOvertime = ({ app }: RootState) => app.pomelloState.overtime;

export const selectPomelloStatus = ({ app }: RootState) => app.pomelloState.status;

export const selectServiceId = ({ app }: RootState) => app.serviceId;

export const selectSettings = ({ app }: RootState) => app.settings;

export const selectTimer = ({ app }: RootState) => app.pomelloState.timer;

export default appSlice.reducer;
