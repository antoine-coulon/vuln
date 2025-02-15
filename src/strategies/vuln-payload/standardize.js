// Import Internal Dependencies
import { VULN_MAPPERS } from "./mappers.js";

export function standardizeVulnsPayload(strategy, vulns) {
    if (!VULN_MAPPERS[strategy]) {
        return [];
    }
    return vulns.map(VULN_MAPPERS[strategy]);
}
