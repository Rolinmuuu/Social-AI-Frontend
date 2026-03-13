import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import PublicIcon from "@mui/icons-material/Public";
import LogOutIcon from "@mui/icons-material/Logout";

const pages = ["Create", "Collection"];
// use json file to store the pages
// for different languages
// rather than hardcoding "Create" and "Collection"

function ResponsiveAppBar(props) {
  const { isLoggedIn, handleLogout } = props;
  const [anchorElNav, setAnchorElNav] = useState(null);
  const navigate = useNavigate();
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleNavigate = (page) => {
    navigate(`/${page.toLowerCase()}`);
    handleCloseNavMenu();
  };
  return (
    <AppBar
      position="static"
      style={{ background: "black", top: 0, position: "fixed", zIndex: 1 }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <PublicIcon
            sx={{
              display: { xs: isLoggedIn ? "none" : "flex", md: "flex" },
              mr: 1,
            }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: isLoggedIn ? "none" : "flex", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Social AI
          </Typography>

          {isLoggedIn && (
            <>
              {/* 以下两个 box 是用来显示菜单按钮的 */}
              {/* 第一个 box 是用来显示小屏幕的菜单按钮 */}
              {/* 第二个 box 是用来显示大屏幕的菜单按钮 */}
              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: "block", md: "none" },
                  }}
                >
                  {pages.map((page) => {
                    return (
                      <MenuItem key={page} onClick={() => handleNavigate(page)}>
                        <Typography textAlign="center">{page}</Typography>
                      </MenuItem>
                    );
                  })}
                </Menu>
              </Box>
              {/* 这是第二个 box，用来显示大屏幕的菜单按钮 */}
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {pages.map((page) => (
                  <Button
                    key={page}
                    onClick={() => handleNavigate(page)}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page}
                  </Button>
                ))}
              </Box>
              {/* 这个 box 是用来 Logout 的 */}
              <Box sx={{ flexGrow: 0 }}>
                <Button
                  variant="outlined"
                  startIcon={<LogOutIcon />}
                  onClick={handleLogout}
                  sx={{ backgroundColor: "white" }}
                >
                  Log out
                </Button>
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
