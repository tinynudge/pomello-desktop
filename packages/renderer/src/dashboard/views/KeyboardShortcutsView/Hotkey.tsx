import { useDashboard } from '@/dashboard/context/DashboardContext';
import { FormattedHotkey, HotkeyCommand } from '@pomello-desktop/domain';
import { Component, Match, Switch, createSignal } from 'solid-js';
import { BoundHotkey } from './BoundHotkey';
import { HotkeyRecorder } from './HotkeyRecorder';
import { UnboundHotkey } from './UnboundHotkey';

type HotkeyProps = {
  command: HotkeyCommand;
  onHotkeyChange(command: HotkeyCommand, hotkey: FormattedHotkey): void;
};

export const Hotkey: Component<HotkeyProps> = props => {
  const { getHotkey } = useDashboard();

  const [getIsRecording, setIsRecording] = createSignal(false);

  const handleHotkeyUpdate = () => {
    setIsRecording(true);
  };

  const handleRecordingCancel = () => {
    setIsRecording(false);
  };

  const handleRecordingComplete = (hotkey: FormattedHotkey) => {
    setIsRecording(false);

    props.onHotkeyChange(props.command, hotkey);
  };

  return (
    <Switch fallback={<UnboundHotkey command={props.command} onClick={handleHotkeyUpdate} />}>
      <Match when={getIsRecording()}>
        <HotkeyRecorder
          onRecordingCancel={handleRecordingCancel}
          onRecordingComplete={handleRecordingComplete}
        />
      </Match>
      <Match when={getHotkey(props.command)}>
        {getFormattedHotkey => (
          <BoundHotkey
            command={props.command}
            hotkey={getFormattedHotkey()}
            onClick={handleHotkeyUpdate}
          />
        )}
      </Match>
    </Switch>
  );
};
