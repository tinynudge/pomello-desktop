export type AuthWindowType = PomelloAuth | ServiceAuth;

type PomelloAuth = {
  type: 'pomello';
  action: 'authorize' | 'register';
};

type ServiceAuth = {
  type: 'service';
  serviceId: string;
};
