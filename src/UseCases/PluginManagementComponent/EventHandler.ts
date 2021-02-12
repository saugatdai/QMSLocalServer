export default interface EventHandler{
    eventType: string;
    handleEvent(): () => void;
}