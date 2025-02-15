// Import Internal Dependencies
import { VULN_MODE } from "../../constants.js"

function mapFromSecurityWG(vuln) {
    return {
        id: vuln.id,
        origin: VULN_MODE.SECURITY_WG,
        package: vuln.module_name,
        title: vuln.title,
        description: vuln.overview,
        cves: vuln.cves,
        cvssVector: vuln.cvss_vector,
        cvssScore: vuln.cvss_score,
        vulnerableVersions: [],
        vulnerableRanges: convertStringToArrayWhenDefined(vuln.vulnerable_versions),
        patchedVersions: vuln.patched_versions,
    }
}

function mapFromNPM(vuln) {
    function standardizeSeverity(severity) {
        if (severity === "moderate") return "medium";
        return severity;
    }

    return {
        id: vuln.id,
        origin: VULN_MODE.NPM_AUDIT,
        package: vuln.name,
        title: vuln.title,
        url: vuln.url,
        severity: standardizeSeverity(vuln.severity),
        vulnerableRanges: convertStringToArrayWhenDefined(vuln.range),
        vulnerableVersions: convertStringToArrayWhenDefined(vuln.vulnerableVersions)
    }
}

function mapFromSnyk(vuln) {
    function concatFunctionsVulnVersion(vulnFunctions) {
        return vulnFunctions
            .reduce((ranges, functions) => [...ranges, ...functions.version], []);
    }

    return {
        id: vuln.id,
        origin: VULN_MODE.SNYK,
        package: vuln.package,
        title: vuln.title,
        url: vuln.url,
        description: vuln.description,
        severity: vuln.severity,
        vulnerableVersions: concatFunctionsVulnVersion(vuln.functions),
        vulnerableRanges: vuln.semver.vulnerable,
        cves: vuln.identifiers.CVE,
        cvssVector: vuln.CVSSv3,
        cvssScore: vuln.cvssScore,
        patches: vuln.patches
    }
}

function convertStringToArrayWhenDefined(value) {
    if (!value) return [];
    return [value];
}

export const VULN_MAPPERS = {
    [VULN_MODE.NPM_AUDIT]: mapFromNPM,
    [VULN_MODE.SECURITY_WG]: mapFromSecurityWG,
    [VULN_MODE.SNYK]: mapFromSnyk
};

