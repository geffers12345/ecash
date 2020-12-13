using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace registration.Models
{
    public class Permissions
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public string Description { get; set; }
        public string DateCreated { get; set; }
        public string DateUpdated { get; set; }
        public string DateDeleted { get; set; }
    }
}