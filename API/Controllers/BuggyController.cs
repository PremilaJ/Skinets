using API.DTOs;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace API.Controllers
{
    public class BuggyController : BaseApiController
    {
        [HttpGet("badrequest")]
        public IActionResult GetBadRequest()
        {
            return BadRequest("");
        }
        [HttpGet("notfound")]
        public IActionResult GetNotFound()
        {
            return NotFound();
        }
        [HttpGet("internalerror")]
        public IActionResult GetInternalErro()
        {
            throw new Exception("Tjhis is a test ");
        }
        [HttpGet("unauthorized")]
        public IActionResult GetUnAuthorized()
        {
            return Unauthorized();
        }
        [HttpPost("validationerror")]
        public IActionResult GetValidationError([FromBody]CreateProductDto  product)
        {
            return Ok();
        }
        [Authorize]
        [HttpGet("secret")]
        public IActionResult GetSecret()
        {
            var name = User.FindFirst(ClaimTypes.Name)?.Value;
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Ok("hello" + name + " with a id" + id);
        }
        
    }
}
