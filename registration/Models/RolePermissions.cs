using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace registration.Models
{
    public class RolePermissions
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int RoleId { get; set; }
        public virtual Roles Roles { get; set; }

        [Required]
        public int PermissionId { get; set; }
        public virtual Permissions Permissions { get; set; }
    }
}