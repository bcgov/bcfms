import type { ProjectDetailsType } from '@/bcfms/ipa/schema/ProjectDetailsSchema.ts';
import type { InitialProjectReviewType } from '@/bcfms/ipa/schema/InitialProjectReviewSchema.ts';
import type { IPAType } from '@/bcfms/ipa/schema/IPASchema.ts';
import { getToken } from '@/bcgov_arches_common/api.ts';
import arches from 'arches';
// import type { FileReference } from '@/arches_component_lab/datatypes/file-list/types.ts';
import type { FileReference } from '@/bcgov_arches_common/datatypes/file-list/types.ts';

export async function getBlankIpa(): Promise<IPAType> {
    const response = await fetch(
        arches.urls.api_resource_blank('project_assessment') + '?format=json',
        {},
    );
    return await response.json();
}

export async function submitIPA(
    ...args:
        | [ipaProjectDetails: ProjectDetailsType]
        | [ipaInitialProjectReview: InitialProjectReviewType]
): Promise<IPAType> {
    const csrftoken = await getToken();
    const fd = new FormData();
    const [param] = args;

    if ('project_details' in param) {
        const ipaProjectDetails = param;
        const files =
            ipaProjectDetails.project_details.aliased_data.project_documents
                .aliased_data.project_documents.node_value;

        fd.append(
            'json',
            JSON.stringify({ project_details: ipaProjectDetails }),
        );
        files.forEach((file: FileReference) => {
            fd.append(
                `file-list_${file.node_id}`,
                file.file as File,
                file.name,
            );
        });
    } else {
        const ipaInitialProjectReview = param;
        fd.append(
            'json',
            JSON.stringify({ initial_project_review: ipaInitialProjectReview }),
        );
    }

    const headers: Record<string, string> = {
        'X-CSRFToken': csrftoken,
        Accept: 'application/json',
        // DO NOT set Content-Type; the browser will add the correct multipart boundary.
    };
    const response = await fetch(arches.urls.submit_ipa, {
        method: 'POST',
        headers: headers,
        body: fd,
    });

    if (response.status !== 201) {
        console.log('error', response.statusText);
        throw Error(`Unable to save submission: ${response.statusText}`);
    } else {
        console.log(response);
        return response.json();
    }
}
