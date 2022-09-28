import { NoteType, Settings } from '@domain';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { PomelloState } from '@tinynudge/pomello-service';
import { RootState } from './createStore';

type OverlayView = 'create-task' | NoteType;

interface AppState {
  overlayView: OverlayView | null;
  pomelloState: PomelloState;
  serviceId?: string;
  settings: Settings;
}

const initialState: AppState = {
  overlayView: null,
  pomelloState: null as unknown as PomelloState,
  settings: null as unknown as Settings,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    pomelloStateUpdate: (state, { payload }: PayloadAction<PomelloState>) => {
      state.pomelloState = payload;
    },
    serviceChange: (state, { payload }: PayloadAction<string | undefined>) => {
      state.serviceId = payload;
    },
    setOverlayView: (state, { payload }: PayloadAction<OverlayView>) => {
      state.overlayView = payload;
    },
    unsetOverlayView: state => {
      state.overlayView = null;
    },
  },
});

export const { pomelloStateUpdate, serviceChange, setOverlayView, unsetOverlayView } =
  appSlice.actions;

export const selectAppMode = ({ app }: RootState) =>
  app.pomelloState.timer?.isActive ? app.pomelloState.timer.type : undefined;

export const selectCurrentTaskId = ({ app }: RootState) => app.pomelloState.currentTaskId;

export const selectIsTimerVisible = ({ app }: RootState) => Boolean(app.pomelloState.timer);

export const selectIsOvertimeVisible = ({ app }: RootState) => Boolean(app.pomelloState.overtime);

export const selectIsTimerActive = ({ app }: RootState) =>
  Boolean(app.pomelloState.timer?.isActive);

export const selectOverlayView = ({ app }: RootState) => app.overlayView;

export const selectOvertime = ({ app }: RootState) => app.pomelloState.overtime;

export const selectPomelloStatus = ({ app }: RootState) => app.pomelloState.status;

export const selectServiceId = ({ app }: RootState) => app.serviceId;

export const selectSettings = ({ app }: RootState) => app.settings;

export const selectTimer = ({ app }: RootState) => app.pomelloState.timer;

export default appSlice.reducer;
