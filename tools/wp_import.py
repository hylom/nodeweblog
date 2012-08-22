#!/usr/bin/python

import pickle;

import MySQLdb
import getpass
import pickle
import sys

if __name__ == "__main__":
    #user = raw_input('User: ')
    #password = getpass.getpass('Password: ')
    user = 'nblogadmin'
    password = 'Foo-Bar-2013'

    fh = open(sys.argv[1], 'r')
    posts = pickle.load(fh)
    fh.close()

    fh = open(sys.argv[2], 'r')
    tags = pickle.load(fh)
    fh.close()

    tags_index = {}
    for tag in tags:
        sid = tag['id'] 
        if not sid in tags_index:
            tags_index[sid] = []
        tags_index[sid].append(tag['name'])

    sid = posts[0]['ID']

    # print sid
    # print posts[0]['post_date_gmt']
    # print posts[0]['post_title']
    # print posts[0]['post_excerpt']
    # print posts[0]['post_modified_gmt']
    # print posts[0]['post_name']
    # print posts[0]['post_content']
    # print tags_index[sid]

    conn = MySQLdb.connect(host="dev.w3jp.info",
                           port=3333,
                           db="nblog",
                           user=user,
                           passwd=password,
                           charset="utf8")
    cursor = conn.cursor()

    cursor.execute('set autocommit=0;')
    for post in posts:
        if post['post_status'] != 'publish':
            continue
        sid = post['ID']
        tags = '';
        if sid in tags_index:
            tags = ",".join(tags_index[sid])
        params = ( post['post_name'],
                   post['post_title'],
                   post['post_content'],
                   tags,
                   post['post_modified_gmt'],
                   post['post_modified_gmt'],
                   post['post_date_gmt'] )

        sql = u"""
INSERT INTO nblog.stories
(sid, url, title, body, tags, cdate, mdate, pubdate)
VALUES
(DEFAULT,  %s,  %s,    %s,   %s,   %s,    %s,    %s);
"""
#        print sql % params
        print 'inserting #%s' % (post['post_title'],)
        cursor.execute(sql, params)

    cursor.execute('commit;')
    cursor.execute('set autocommit=1;')
    cursor.close()
    conn.close()
