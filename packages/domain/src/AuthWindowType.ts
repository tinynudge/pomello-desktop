export type AuthWindowType = PomelloAuth | ServiceAuth;

interface PomelloAuth {
  type: 'pomello';
  action: 'authorize' | 'register';
}

interface ServiceAuth {
  type: 'service';
  serviceId: string;
}
