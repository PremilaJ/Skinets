using API.DTOs;
using Core.Entities;
using Microsoft.AspNetCore.Mvc;

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
        
    }
}
