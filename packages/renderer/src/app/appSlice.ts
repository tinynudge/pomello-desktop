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

export const selectOverlayView = (state: RootState) => state.app.overlayView;

export const selectPomelloState = (state: RootState) => state.app.pomelloState;

export const selectServiceId = (state: RootState) => state.app.serviceId;

export const selectSettings = (state: RootState) => state.app.settings;

export default appSlice.reducer;
