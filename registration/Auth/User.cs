using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace registration.Auth
{
    public class User
    {
        public int ID { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Email { get; set; }
        public int RoleId { get; set; }

        /// <summary>
        /// Decode the serialized data. (Inverse of the ToString())
        /// </summary>
        /// <param name="userData">value from the cookie</param>
        /// <returns>User</returns>
        public static User Parse(string userData)
        {
            // split the user by a comma
            var data = userData.Split(',');

            // The order matters.
            //
            var user = new User();

            user.ID = Convert.ToInt32(data[0]);
            user.Firstname = data[1];
            user.Lastname = data[2];
            user.Email = data[3];
            user.RoleId = Convert.ToInt32(data[4]);

            return user;
        }

        /// <summary>
        /// Serialize the user data into a comma-separated value
        /// </summary>
        /// <returns>comma-separated value of user data</returns>
        public override string ToString()
        {
            // Check if the username is blank.
            if (string.IsNullOrEmpty(Email))
                return "";

            var stringBuilder = new StringBuilder();

            stringBuilder
                .Append(ID) // this will later be data[0] after splitting by comma (,)
                .Append(",")
                .Append(Firstname) // this will later be data[1]
                .Append(",")
                .Append(Lastname)
                .Append(",")
                .Append(Email)
                .Append(",")
                .Append(RoleId);

            return stringBuilder.ToString();
        }
    }
}