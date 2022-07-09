import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { PomelloState } from '@tinynudge/pomello-service';
import { RootState } from './createStore';

interface AppState {
  serviceId?: string;
  pomelloState: PomelloState;
}

const initialState: AppState = {
  pomelloState: null as unknown as PomelloState,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    pomelloStateUpdate: (state, { payload }: PayloadAction<PomelloState>) => {
      state.pomelloState = payload;
    },
    serviceChange: (state, { payload }: PayloadAction<string>) => {
      state.serviceId = payload;
    },
  },
});

export const { pomelloStateUpdate, serviceChange } = appSlice.actions;

export const selectPomelloState = (state: RootState) => state.app.pomelloState;

export const selectServiceId = (state: RootState) => state.app.serviceId;

export default appSlice.reducer;
