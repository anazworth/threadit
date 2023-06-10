import logger from "pino";
import dayjs from "dayjs";

const log = logger({
    target: "pino-pretty",
    timestamp: () => `,"time":"${dayjs().format()}"`,
    messageKey: "message",
    levelKey: "severity",
});

export default log;
