-- Seed the geographic hierarchy: Telangana -> Komaram Bheem Asifabad -> Sirpur -> 7 mandals
insert into locations (name, type) values ('Telangana', 'state');

insert into locations (name, type, parent_id)
select 'Komaram Bheem Asifabad', 'district', id from locations where name = 'Telangana';

insert into locations (name, type, parent_id)
select 'Sirpur', 'constituency', id from locations where name = 'Komaram Bheem Asifabad';

insert into locations (name, type, parent_id)
select m, 'mandal', (select id from locations where name = 'Sirpur' and type = 'constituency')
from unnest(array[
  'Kouthala','Bejjur','Kagaznagar','Sirpur (T)','Dahegaon','Penchikalpet','Chintalamanepally'
]) as m;

-- Seed the five flagship programs (location/funding linked later in-app)
insert into programs (name, theme, status, scope, beneficiaries_target) values
  ('ArogyaSetu Mobile Medical Unit', 'health',      'planned', 'constituency', 15000),
  ('Sthree Swabhiman (MHM)',         'empowerment', 'planned', 'constituency', 5000),
  ('STEM Labs',                       'education',   'planned', 'constituency', 3000),
  ('Integrated Learning Center',      'education',   'planned', 'constituency', 1000),
  ('Skill Development',               'empowerment', 'planned', 'state',        2000);
