#!/usr/bin/python

import pickle;

#import MySQLdb
import getpass
import pickle
import sys

if __name__ == "__main__":
#    user = raw_input('User: ')
#    password = getpass.getpass('Password: ')

    fh = open(sys.argv[1], 'r')
    posts = pickle.load(fh)
    fh.close()

    print posts[0]['post_date_gmt']
    print posts[0]['post_title']
    print posts[0]['post_excerpt']
    print posts[0]['post_modified_gmt']
    print posts[0]['post_name']
    print posts[0]['post_content']

#    conn = MySQLdb.connect(host="dev.w3jp.info", db="nblog", user=user, passwd=password, charset="utf8")
#    cursor = conn.cursor()

#    sql = u"select * from wordpress.wp_posts;"
#    cursor.execute(sql)
