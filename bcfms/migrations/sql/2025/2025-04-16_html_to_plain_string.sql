drop function if exists databc.html_to_plain_string cascade;
create or replace function databc.html_to_plain_string(string_to_clean text) returns text as
$$
declare
begin
    return left(
            trim(
                    regexp_replace(
                            regexp_replace( -- <li> -> -
                                    regexp_replace( -- UL/LI to \n
                                            regexp_replace(string_to_clean, '<[/]{0,1}p>', '', 'gi')
                                        , '<ul><li>', E'\n- ', 'gi'),
                                    '<li>', '- ', 'gi'
                                ),
                            '(</ul>|</li>)', '', 'gi'
                        )), 4000);
end
$$ language plpgsql;
ALTER FUNCTION databc.html_to_plain_string(string_to_clean text) SECURITY DEFINER SET search_path = public;