using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace registration.Models
{
    public class Logs
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int AccountId { get; set; }
        public virtual Accounts Accounts { get; set; }

        [Required]
        public string Action { get; set; }

        public string DateCreated { get; set; }
        public string DateUpdated { get; set; }
        public string DateDeleted { get; set; }
    }
}