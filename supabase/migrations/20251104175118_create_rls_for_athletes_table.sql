create policy "Enable read access for all users" on "public"."athletes" as permissive for
select to public using (true);