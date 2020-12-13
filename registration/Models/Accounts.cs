using registration.Helpers;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace registration.Models
{
    public class Accounts
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Firstname { get; set; }

        [Required]
        public string Lastname { get; set; }
        
        public string Middlename { get; set; }

        public string Gender { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        [Required]
        public string Contact { get; set; }

        [Required]
        public int RoleId { get; set; }
        public virtual Roles Roles { get; set; }

        public string Image { get; set; }

        public string DateCreated { get; set; }
        public string DateUpdated { get; set; }
        public string DateDeleted { get; set; }

        public static List<Ability> permissionFor(string moduleName)
        {
            var abilities = new List<Ability>();

            using (var dbconn = new SqlConnection(ConfigurationManager.ConnectionStrings["dbconnection"].ConnectionString))
            {
                if (dbconn.State == ConnectionState.Open)
                    dbconn.Close();

                dbconn.Open();

                using (var cmd = new SqlCommand("spHasModulePermission", dbconn))
                {
                    try
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("userId", Auth.Auth.user().ID);
                        cmd.Parameters.AddWithValue("module", moduleName);

                        var reader = cmd.ExecuteReader();

                        while (reader.Read())
                        {
                            var permissionName = reader["Name"].ToString();
                            if (permissionName.Contains("View"))
                            {
                                abilities.Add(Ability.View);
                            }
                            else if (permissionName.Contains("Create"))
                            {
                                abilities.Add(Ability.Create);
                            }
                            else if (permissionName.Contains("Delete"))
                            {
                                abilities.Add(Ability.Delete);
                            }
                            else if (permissionName.Contains("Modify"))
                            {
                                abilities.Add(Ability.Update);
                            }
                        }
                    }
                    catch (Exception)
                    {
                        // ignored
                    }
                }
            }

            return abilities;
        }
    }
}