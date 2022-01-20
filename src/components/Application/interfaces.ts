export interface ApplicationConfig {
  id: string;
  name: string;
  description?: string;
  icon: CallableFunction;
  application?: CallableFunction;
}