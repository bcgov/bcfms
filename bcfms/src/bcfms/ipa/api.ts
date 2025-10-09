import type { ProjectDetailsType } from '@/bcfms/ipa/schema/ProjectDetailsSchema.ts';
import type { IPAType } from '@/bcfms/ipa/schema/IPASchema.ts';
import { getToken } from '@/bcgov_arches_common/api.ts';
import arches from 'arches';

export async function getBlankIpa(): Promise<IPAType> {
    const response = await fetch(
        arches.urls.api_resource_blank('project_assessment') + '?format=json',
        {},
    );
    return await response.json();
}

export async function submitIPA(
    ipaProjectDetails: ProjectDetailsType,
): Promise<IPAType> {
    const csrftoken = await getToken();
    const response = await fetch(
        arches.urls.submit_ipa,
        // 'bc-fossil-management/api/submit-ipa/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({ project_details: ipaProjectDetails }),
        },
    );
    if (response.status !== 201) {
        console.log('error', response.statusText);
        throw Error(`Unable to save submission: ${response.statusText}`);
    } else {
        console.log(response);
        return response.json();
    }
}
