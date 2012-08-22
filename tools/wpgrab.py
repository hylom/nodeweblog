#!/usr/bin/python

import MySQLdb
import getpass
import pickle

if __name__ == "__main__":
    user = raw_input('User: ')
    password = getpass.getpass('Password: ')

    conn = MySQLdb.connect(host="localhost", db="wordpress", user=user, passwd=password, charset="utf8")
    cursor = conn.cursor()

    sql = u"select * from wordpress.wp_posts;"
    cursor.execute(sql)

    keys = ( 'ID',
             'post_author',
             'post_date',
             'post_date_gmt',
             'post_content',
             'post_title',
             'post_excerpt',
             'post_status',
             'comment_status',
             'ping_status',
             'post_password',
             'post_name',
             'to_ping',
             'pinged',
             'post_modified',
             'post_modified_gmt',
             'post_content_filtered',
             'post_parent',
             'guid',
             'menu_order',
             'post_type',
             'post_mime_type',
             'comment_count',
           )
 
    posts = [] 
    for row in cursor:
        item = {}
        for i in range(0, len(keys)):
            item[keys[i]] = row[i]
        posts.append(item)

    sql = u"""select wp_terms.name, wp_terms.slug, wp_term_relationships.object_id
  from wp_terms
  join wp_term_taxonomy
  on wp_terms.term_id = wp_term_taxonomy.term_id
  join wp_term_relationships
  on wp_term_taxonomy.term_taxonomy_id = wp_term_relationships.term_taxonomy_id;
"""
    cursor.execute(sql)

    tags = []
    for row in cursor:
        tag = {
            "name": row[0],
            "slug": row[1],
            "id": row[2]
            }
        tags.append(tag)

    cursor.close()
    conn.close()

    fh = open('./wp.pickle', 'w')
    pickle.dump(posts, fh)
    fh.close()

    fh = open('./wp_tags.pickle', 'w')
    pickle.dump(tags, fh)
    fh.close()


