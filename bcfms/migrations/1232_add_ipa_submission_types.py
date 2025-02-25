from django.db import migrations

add_concepts = """
    DO $$
        DECLARE
            scheme_uuid uuid;
            top_collection_uuid uuid;
            value json;
            child_values json;
            requirements json[] = array[
                '{"label": "Chance Find Protocol","values": [{"type": "sortorder", "value": "05"}, {"type": "abbreviation", "value": "CFP"}]}'::json,
                '{"label": "Preliminary Study Report","values": [{"type": "sortorder", "value": "10"}, {"type": "abbreviation", "value": "PSR"}]}'::json,
                '{"label": "Fossil Impact Assessment Plan","values": [{"type": "sortorder", "value": "15"}, {"type": "abbreviation", "value": "FIAP"}]}'::json,
                '{"label": "Fossil Impact Assessment","values": [{"type": "sortorder", "value": "20"}, {"type": "abbreviation", "value": "FIA"}]}'::json,
                '{"label": "Impact Mitigation Plan","values": [{"type": "sortorder", "value": "25"}, {"type": "abbreviation", "value": "IMP"}]}'::json,
                '{"label": "Impact Mitigation Final Report","values": [{"type": "sortorder", "value": "30"}, {"type": "abbreviation", "value": "IMFR"}]}'::json,
                '{"label": "Site Assessment Plan","values": [{"type": "sortorder", "value": "35"}, {"type": "abbreviation", "value": "SAP"}]}'::json,
                '{"label": "Site Assessment Final Report","values": [{"type": "sortorder", "value": "40"}, {"type": "abbreviation", "value": "SAFR"}]}'::json,
                '{"label": "Other Requirement","values": [{"type": "sortorder", "value": "45"}, {"type": "abbreviation", "value": "OTH"}]}'::json];
            top_values json;
        BEGIN
            -- This needs to be well known to match with the IPA resource model node
            top_collection_uuid := '6e1cdc31-0f16-4bd0-8fcc-b3246a808295'::uuid;
            scheme_uuid := get_concept_uuid('BC Fossils Thesauri', 'ConceptScheme');
            top_values := import_vocabulary_item_with_collection(
                    p_parent_concept_uuid => scheme_uuid,
                    p_child_label => 'IPA Project Requirement',
                    p_concept_relationship => 'hasTopConcept',
                    p_parent_collection_uuid => null,
                          p_child_collection_uuid => top_collection_uuid);
            raise Notice 'Top values: %', top_values;
            foreach value in ARRAY requirements loop
                    child_values := import_vocabulary_item_with_values(
                            p_parent_concept_uuid => (top_values->>'concept_id')::uuid,
                            p_child_label => value->>'label',
                            p_parent_collection_uuid => (top_values->>'collection_id')::uuid,
                            p_additional_values => value->'values');
                end loop;
        END $$;
    """

delete_concepts = """
   call delete_concept_and_children('IPA Project Requirement');
   """


class Migration(migrations.Migration):
    dependencies = [
        ("bcfms", "1232_add_abbreviation_value_type"),
        ("bcgov_arches_common", "2025-02-07_create_concept_functions"),
    ]

    operations = [
        migrations.RunSQL(add_concepts, delete_concepts),
    ]
