import type { IPAType } from '@/bcfms/ipa/schema/IPASchema.ts';
import { getToken } from '@/bcgov_arches_common/api.ts';
import arches from 'arches';
// import type { FileReference } from '@/arches_component_lab/datatypes/file-list/types.ts';
import type { FileReference } from '@/bcgov_arches_common/datatypes/file-list/types.ts';
import type { IPAListResponseType } from '@/bcfms/ipa/types.ts';

export async function getBlankIpa(): Promise<IPAType> {
    const response = await fetch(
        arches.urls.api_resource_blank('project_assessment') + '?format=json',
        {},
    );
    return await response.json();
}

export async function getIpa(resourceinstanceid: string): Promise<IPAType> {
    const response = await fetch(
        arches.urls.api_resource('project_assessment', resourceinstanceid) +
            '?format=json&fill_blanks=true',
        {},
    );
    return await response.json();
}

export async function getIpasForReview(
    url: string | null,
): Promise<IPAListResponseType> {
    const response = await fetch(
        url ??
            `${arches.urls.ipas_for_review}?format=json&page=0&sort=createdtime`,
        {},
    );
    return await response.json();
}

export async function submitIPA(ipa: IPAType): Promise<IPAType> {
    const csrftoken = await getToken();
    const fd = new FormData();

    const files =
        ipa.aliased_data.project_details.aliased_data.project_documents
            .aliased_data.project_documents.node_value;

    fd.append('json', JSON.stringify(ipa));
    files.forEach((file: FileReference) => {
        fd.append(`file-list_${file.node_id}`, file.file as File, file.name);
    });

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

export async function submitIPAReview(ipa: IPAType): Promise<IPAType> {
    const csrftoken = await getToken();
    const fd = new FormData();
    fd.append('json', JSON.stringify(ipa));

    const headers: Record<string, string> = {
        'X-CSRFToken': csrftoken,
        Accept: 'application/json',
        // DO NOT set Content-Type; the browser will add the correct multipart boundary.
    };
    const response = await fetch(
        arches.urls.submit_ipa_review(ipa.resourceinstanceid),
        {
            method: 'PATCH',
            headers: headers,
            body: fd,
        },
    );

    if (response.status !== 200) {
        console.log('error', response.statusText);
        throw Error(`Unable to save submission: ${response.statusText}`);
    } else {
        console.log(response);
        return response.json();
    }
}
