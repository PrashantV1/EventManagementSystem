create or replace package You is
  --Dummy Package for user login ,inserting and adding friend,adding post 
  Procedure Valid_login(P_user   in varchar2,
                        P_pass   in varchar2,
                        P_output out varchar2);
  Procedure update_password(P_user   in varchar2,
                            P_pass   in varchar2,
                            P_output out varchar2);
  Procedure Reset_Password(P_user   in varchar2,
                           P_output out varchar2);

  Procedure Confirm_reset_password(P_user   in varchar2,
                                   P_otp    in varchar2,
                                   P_pass   in varchar2,
                                   P_output out varchar2);
  Procedure Insert_user(P_NAME     in varchar2,
                        P_EMAIL    in varchar2,
                        P_USERNAME in varchar2,
                        P_PASS     in varchar2,
                        P_output   out varchar2);
  Procedure add_remove_frnd(P_requestee in number,
                            P_user      in number,
                            P_action    in varchar2,
                            P_output    out Varchar2);
  Procedure confirm_friend(P_requestee in number,
                           P_user      in number,
                           P_action    in varchar2,
                           P_output    out Varchar2);

  Procedure Search_list(P_user   in varchar2,
                        P_date   in varchar2,
                        P_search in varchar2,
                        P_output out sys_refcursor);
  Procedure Add_post(P_requestee in number,
                     P_post      in varchar2,
                     P_output    out varchar2);
  Procedure Update_delete_post(P_post_id in number,
                               P_post    in varchar2,
                               P_action  in varchar2,
                               P_output  out varchar2);
  Procedure get_user_session(p_user_id in varchar2,
                             p_output  out varchar2);


  Procedure insert_user_session(p_user_id in varchar2);
  Procedure update_user_session(p_user_id in varchar2,
                                p_output  out varchar2);

end You;
/
create or replace package body You is

  Procedure Valid_login(P_user   in varchar2,
                        P_pass   in varchar2,
                        P_output out varchar2) is
  begin
    begin
      select 'Y'
        into P_output
        from app_user
       where user_username = P_user
             and User_pass = P_pass;
    
    exception
      when no_data_found then
        P_output := 'N';
    end;
    if p_output = 'Y'
    then
      insert_user_session(P_user);
    end if;
  end;

  Procedure Update_Password(P_user   in varchar2,
                            P_pass   in varchar2,
                            P_output out varchar2) is
  begin
    begin
      update app_user set User_pass = P_pass where user_username = P_user;
      P_output := 'Password Changed Succesfully';
    exception
      when others then
        P_output := 'Error: ' || sqlerrm;
    end;
  end;
  Procedure Reset_Password(P_user   in varchar2,
                           P_output out varchar2) is
    v_generated_otp number;
    v_email         varchar2(50);
  begin
    v_generated_otp := LpAD(round(dbms_random.value(1, 999999)), 4, '0');
    select USER_EMAIL
      into v_email
      from app_user
     where user_username = P_user;
    begin
      utl_mail.send('App@app.com',
                    v_email,
                    null,
                    null,
                    'OTP for password',
                    v_generated_otp,
                    null);
      insert into APP_USER_otp_STG
      values
        (P_user,
         v_generated_otp,
         sysdate,
         sysdate + 10 / 3600);
      P_output := 'OTP sent to registerd email ';
    exception
      when others then
        P_output := 'Error ' || sqlerrm;
    end;
  end;

  Procedure Confirm_reset_password(P_user   in varchar2,
                                   P_otp    in varchar2,
                                   P_pass   in varchar2,
                                   P_output out varchar2) is
    V_confirm varchar2(1);
  begin
    begin
      select 'Y'
        into V_confirm
        from APP_USER_otp_STG
       where user_id = P_user
             and user_otp = P_otp
             and sysdate between request_sent_time and request_valid_time;
    exception
      when no_data_found then
        V_confirm := 'N';
    end;
    If V_confirm = 'N'
    then
      P_output := 'Invalid Otp';
    else
      update app_user set User_pass = P_pass where user_username = P_user;
      P_output := 'Password Changed Succesfully';
    end if;
  end;


  Procedure Insert_user(P_NAME     in varchar2,
                        P_EMAIL    in varchar2,
                        P_USERNAME in varchar2,
                        P_PASS     in varchar2,
                        P_output   out varchar2) is
    v_user  number;
    v_count number;
  begin
    select count(*)
      into v_count
      from app_user
     where USER_username = p_username;
    if v_count = 1
    then
      P_output := 'User already exists';
    else
      v_user := vash.app_user_id.nextval;
      insert into app_user
        (
         
         USER_ID,
         USER_NAME,
         USER_EMAIL,
         USER_USERNAME,
         
         USER_PASS)
      values
        (v_user,
         P_NAME,
         P_EMAIL,
         P_USERNAME,
         P_PASS);
      P_output := 'User added successfully ' || v_user;
    end if;
  end;

  Procedure add_remove_frnd(P_requestee in number,
                            P_user      in number,
                            P_action    in varchar2,
                            P_output    out Varchar2) is
  begin
    If P_action = 'ADD'
    then
      insert into APP_USER_FRND_stg
      values
        (P_requestee,
         P_user,
         'P',
         sysdate,
         null);
      P_output := 'Friend Request Successfully Sent ';
    elsif P_action = 'Remove'
    then
      delete from APP_USER_FRND
       where user_id = P_requestee
             and user_frnd_id = P_user;
      delete from APP_USER_FRND
       where user_id = P_user
             and user_frnd_id = P_requestee;
      P_output := 'Friend Removed Successfully ';
    end if;
  end;



  Procedure confirm_friend(P_requestee in number,
                           P_user      in number,
                           P_action    in varchar2,
                           P_output    out Varchar2) is
  begin
    if P_action = 'Confirm'
    then
      update APP_USER_FRND_stg
         set status              = 'Y',
             REQUEST_ACTION_TIME = sysdate
       where user_id = P_user
             and user_frnd_id = P_requestee;
      insert into APP_USER_FRND
      values
        (P_requestee,
         P_user,
         sysdate,
         null);
      insert into APP_USER_FRND
      values
        (P_user,
         P_requestee,
         sysdate,
         null);
      P_output := 'Request accepted';
    elsif P_action = 'Delete'
    then
      update APP_USER_FRND_stg
         set status              = 'N',
             REQUEST_ACTION_TIME = sysdate
       where user_id = P_user
             and user_frnd_id = P_requestee;
      P_output := 'Request Rejected';
    end if;
  end;


  Procedure Search_list(P_user   in varchar2,
                        P_date   in varchar2,
                        P_search in varchar2,
                        P_output out sys_refcursor) is
  begin
    open P_output for
      select r.user_name, r.user_email
        from APP_USER_FRND a, app_user r
       where a.user_frnd_id = r.user_id
             and a.user_id = P_user
             and P_date between USER_DATE and
             nvl(USER_DATE_END, sysdate + 1)
             and r.user_name like '%' || nvl(P_search, user_name) || '%'
       order by USER_DATE desc;
  end;


  Procedure Add_post(P_requestee in number,
                     P_post      in varchar2,
                     P_output    out varchar2) is
  begin
    begin
      insert into APP_USER_feed
      values
        (P_requestee,
         P_post,
         sysdate,
         null,
         vash.APP_USER_feed_Seq.nextval);
      P_output := 'Post added successfullly' ||
                  vash.APP_USER_feed_Seq.currval;
    exception
      when others then
        P_output := 'Error : ' || sqlerrm;
    end;
  end;
  Procedure Update_delete_post(P_post_id in number,
                               P_post    in varchar2,
                               P_action  in varchar2,
                               P_output  out varchar2) is
  begin
    if P_action = 'UPDATE'
    then
      begin
        update APP_USER_feed
           set USER_POST = P_post
         where USER_POST_ID = P_post_id;
        P_output := 'Updated Succesfully';
      exception
        when others then
          P_output := 'Error :' || sqlerrm;
      end;
    elsif P_action = 'DELETE'
    then
      delete from APP_USER_feed where USER_POST_ID = P_post_id;
      P_output := 'Deleted Succesfully';
    end if;
  
  end;


  Procedure get_user_session(p_user_id in varchar2,
                             p_output  out varchar2) IS
  
  begin
    select session_id
      into p_output
      from APP_USER_session
     where user_id = p_user_id
           and sysdate between session_from and
           nvl(session_to, '31-dec-2099');
  exception
    when no_data_found then
      P_output := 0;
  end;

  Procedure insert_user_session(p_user_id in varchar2) IS
  
  begin
    insert into APP_USER_session
    values
      (p_user_id,
       1,
       sysdate,
       null);
  end;

  Procedure update_user_session(p_user_id in varchar2,
                                p_output  out varchar2) IS
  
  begin
    update APP_USER_session
       set session_id = 0,
           session_to = sysdate
     where session_id = 1
           and user_id = p_user_id;
    P_output := 'Session logout';
  
  end;



end You;
/
