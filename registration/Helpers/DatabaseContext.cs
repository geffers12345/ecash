using registration.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace registration.Helpers
{
    public class DatabaseContext : DbContext
    {
        public DbSet<Roles> Roles { get; set; }
        public DbSet<Accounts> Accounts { get; set; }
        public DbSet<Logs> Logs { get; set; }
        public DbSet<Permissions> Permissions { get; set; }
        public DbSet<RolePermissions> RolePermissions { get; set; }
        public DbSet<Audits> Audits { get; set; }
        public DbSet<StudentTransactions> StudentTransactions { get; set; }

        public DatabaseContext() : base("dbconnection")
        {

        }
    }
}