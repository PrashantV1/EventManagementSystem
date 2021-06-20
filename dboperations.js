const config = require("./dbconfig");

let connection;
var oracledb = require("oracledb");

//Package name-You
async function insert_user(P_name, P_EMAIL, P_USERNAME, P_pass) {
  const name = P_name;
  const email = P_EMAIL;
  const username = P_USERNAME;
  const pass = P_pass;
  try {
    connection = await oracledb.getConnection(config);
    const result = await connection.execute(
      `begin
    -- Call the procedure
    You.insert_user(:P_name,
                    :P_EMAIL,
                     :P_USERNAME,
                   :P_pass,
               :P_output);
    end;
    `,
      {
        P_name: name, // Bind type is determined from the data.  Default direction is BIND_IN
        P_EMAIL: email,
        P_USERNAME: username,
        P_pass: pass,
        P_output: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR },
        // ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 40 }
      },
      { autoCommit: true }
    );
    return result.outBinds.P_output;
  } catch (error) {
    console.log(error);
  }
}

async function validlogin(P_user, P_pass) {
  const user = P_user;
  const password = P_pass;

  try {
    connection = await oracledb.getConnection(config);
    const result = await connection.execute(
      `begin
    -- Call the procedure
    You.Valid_login(:P_user,
                    :P_pass,
                    :P_output);
    end;
    `,
      {
        P_user: user, // Bind type is determined from the data.  Default direction is BIND_IN
        P_pass: password,
        P_output: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR },
        // ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 40 }
      },
      { autoCommit: true }
    );
    return result.outBinds.P_output;
  } catch (error) {
    console.log(error);
  }
}

async function updatepassword(P_user, P_pass) {
  const user = P_user;
  const password = P_pass;

  try {
    connection = await oracledb.getConnection(config);
    const result = await connection.execute(
      `begin
    -- Call the procedure
    You.Update_Password(:P_user,
                    :P_pass,
                    :P_output);
    end;
    `,
      {
        P_user: user,
        P_pass: password,
        P_output: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR },
      },
      { autoCommit: true }
    );
    return result.outBinds.P_output;
  } catch (error) {
    console.log(error);
  }
}

async function Reset_Password(p_user_id) {
  const user = p_user_id;

  try {
    connection = await oracledb.getConnection(config);
    const result = await connection.execute(
      `begin
    -- Call the procedure
    You.Reset_Password(:p_user_id, :P_output);
    end;
    `,
      {
        p_user_id: user,
        P_output: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR },
      },
      { autoCommit: true }
    );
    return result.outBinds.P_output;
  } catch (error) {
    console.log(error);
  }
}

async function Confirm_reset_password(P_user, P_otp, P_pass) {
  const user = P_user;
  const otp = P_otp;
  const pass = P_pass;
  try {
    connection = await oracledb.getConnection(config);
    const result = await connection.execute(
      `begin
    -- Call the procedure
    You.insert_user(:P_user,
                    :P_otp,
                   :P_pass,
               :P_output);
    end;
    `,
      {
        P_user: user,
        P_otp: otp,
        P_pass: pass,
        P_output: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR },
      },
      { autoCommit: true }
    );
    return result.outBinds.P_output;
  } catch (error) {
    console.log(error);
  }
}

async function add_remove_frnd(P_requestee, P_user, P_action) {
  const user = P_user;
  const requestee = P_requestee;
  const action = P_action;
  try {
    connection = await oracledb.getConnection(config);
    const result = await connection.execute(
      `begin
    -- Call the procedure
    You.insert_user(:P_requestee,
                    :P_user,
                   :P_action,
               :P_output);
    end;
    `,
      {
        P_requestee: requestee,
        P_user: user,
        P_action: action,
        P_output: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR },
      },
      { autoCommit: true }
    );
    return result.outBinds.P_output;
  } catch (error) {
    console.log(error);
  }
}

async function confirm_friend(P_requestee, P_user, P_action) {
  const user = P_user;
  const requestee = P_requestee;
  const action = P_action;
  try {
    connection = await oracledb.getConnection(config);
    const result = await connection.execute(
      `begin
    -- Call the procedure
    You.confirm_friend(:P_requestee,
                    :P_user,
                   :P_action,
               :P_output);
    end;
    `,
      {
        P_requestee: requestee,
        P_user: user,
        P_action: action,
        P_output: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR },
      },
      { autoCommit: true }
    );
    return result.outBinds.P_output;
  } catch (error) {
    console.log(error);
  }
}

async function Add_post(P_user, P_post) {
  const user = P_user;
  const post = P_post;

  try {
    connection = await oracledb.getConnection(config);
    const result = await connection.execute(
      `begin
    -- Call the procedure
    You.Valid_login(:P_user,
                    :P_post,
                    :P_output);
    end;
    `,
      {
        P_user: user,
        P_post: post,
        P_output: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR },
      },
      { autoCommit: true }
    );
    return result.outBinds.P_output;
  } catch (error) {
    console.log(error);
  }
}

async function Update_delete_post(P_post_id, P_post, P_action) {
  const postid = P_post_id;
  const post = P_post;
  const action = P_action;
  try {
    connection = await oracledb.getConnection(config);
    const result = await connection.execute(
      `begin
    -- Call the procedure
    You.confirm_friend(:P_post_id,
                    :P_post,
                   :P_action,
               :P_output);
    end;
    `,
      {
        P_post_id: postid,
        P_post: post,
        P_action: action,
        P_output: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR },
      },
      { autoCommit: true }
    );
    return result.outBinds.P_output;
  } catch (error) {
    console.log(error);
  }
}

async function Search_list(P_user, P_date, P_search) {
  const user = P_user;
  const date = P_date;
  const search = P_search;
  try {
    connection = await oracledb.getConnection(config);
    const result = await connection.execute(
      `begin
    -- Call the procedure
    You.Search_list(:P_user,
                    :P_date,
                   :P_search,
               :P_output);
    end;
    `,
      {
        P_user: user,
        P_date: date,
        P_search: search,
        P_output: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_CURSOR },
      },
      { autoCommit: true }
    );
    return result.outBinds.P_output;
  } catch (error) {
    console.log(error);
  }
}

async function update_user_session(p_user_id) {
  const user = p_user_id;

  try {
    connection = await oracledb.getConnection(config);
    const result = await connection.execute(
      `begin
    -- Call the procedure
    You.update_user_session(:p_user_id, :P_output);
    end;
    `,
      {
        p_user_id: user,
        P_output: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR },
      },
      { autoCommit: true }
    );
    return result.outBinds.P_output;
  } catch (error) {
    console.log(error);
  }
}

async function get_user_session(p_user_id) {
  const user = p_user_id;

  try {
    connection = await oracledb.getConnection(config);
    const result = await connection.execute(
      `begin
    -- Call the procedure
    You.get_user_session(:p_user_id, :P_output);
    end;
    `,
      {
        p_user_id: user,
        P_output: { dir: oracledb.BIND_OUT, type: oracledb.DB_TYPE_VARCHAR },
      },
      { autoCommit: true }
    );
    return result.outBinds.P_output;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  validlogin: validlogin,
  updatepassword: updatepassword,
  reset_Password: Reset_Password,
  confirm_reset_password: Confirm_reset_password,
  insert_user: insert_user,
  add_remove_frnd: add_remove_frnd,
  confirm_friend: confirm_friend,
  add_post: Add_post,
  update_delete_post: Update_delete_post,
  search_list: Search_list,
  updatesession: update_user_session,
  getusersession: get_user_session,
};
