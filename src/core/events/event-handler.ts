export interface IEventHandler {
	setupSubscription(): Promise<void>;
}
