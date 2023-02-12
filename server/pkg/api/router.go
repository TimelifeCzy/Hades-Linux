package api

import (
	"fmt"
	gApi "hboat/pkg/api/grpc"
	"hboat/pkg/api/host"
	"hboat/pkg/api/plugin"
	"hboat/pkg/api/static"
	"hboat/pkg/api/user"
	"hboat/pkg/middleware"
	"net/http"
	"path"
	"strings"

	"github.com/gin-gonic/gin"
)

func Cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Headers", "*")
		c.Header("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, OPTIONS")
		c.Header("Access-Control-Allow-Credentials", "false")
		c.Header("Access-Control-Max-Age", "172800")
		c.Header("Access-Control-Expose-Headers", "*")
		c.Set("content-type", "application/json")
		if c.Request.Method == "OPTIONS" {
			c.JSON(http.StatusOK, "")
		}
		c.Next()
	}
}

// regist the frontend
func routerFrontend(r *gin.Engine) {
	staticHandler := func(ctx *gin.Context) {
		fullPath := ctx.Request.URL.Path
		fileName := ""
		fileType := ""
		if strings.HasSuffix(fullPath, ".js") ||
			strings.HasSuffix(fullPath, ".css") ||
			strings.HasSuffix(fullPath, ".png") ||
			strings.HasSuffix(fullPath, ".svg") ||
			strings.HasSuffix(fullPath, ".ico") ||
			strings.HasSuffix(fullPath, ".ttf") {
			fileName = strings.Split(fullPath, "/")[len(strings.Split(fullPath, "/"))-1]
			fileType = strings.Split(fullPath, ".")[len(strings.Split(fullPath, "."))-1]
		} else {
			ctx.Header("Content-Type", "text/html")
			ret, err := static.FrontendFile.ReadFile("frontend/index.html")
			if err != nil {
				_, _ = ctx.Writer.Write([]byte(err.Error()))
				return
			} else {
				ctx.Header("Content-Length", fmt.Sprint(len(ret)))
				_, _ = ctx.Writer.Write(ret)
			}
		}
		switch fileType {
		case "js":
			ctx.Header("Content-Type", "application/javascript")
		case "css":
			ctx.Header("Content-Type", "text/css")
		case "png":
			ctx.Header("Content-Type", "image/png")
		case "svg":
			// Modify
			ctx.Header("Content-Type", "image/svg+xml; charset=utf-8")
		case "ico":
			ctx.Header("Content-Type", "image/x-icon")
		case "ttf":
			ctx.Header("Content-Type", "font/ttf")
		}
		ctx.Header("Content-Description", "File Transfer")
		ctx.Header("Content-Transfer-Encoding", "binary")
		ctx.Header("Content-Disposition", "attachment; filename="+fileName)
		ctx.FileFromFS(path.Join("frontend", fileName), http.FS(static.FrontendFile))
	}

	r.GET("/", staticHandler)
	r.GET("/index.html", staticHandler)
	r.GET("/user/login", staticHandler)
	r.GET("/plugincenter", staticHandler)
	r.NoRoute(staticHandler)
}

func RunGrpcServer(port int) {
	// release mode
	gin.SetMode(gin.ReleaseMode)
	router := gin.Default()
	// frontend
	routerFrontend(router)

	// /api/v1
	apiv1Router := router.Group("/api/v1")
	apiv1Router.Use(middleware.Auth())
	{
		// user related
		userGroup := apiv1Router.Group("/user")
		userGroup.POST("/login", user.Login)
		userGroup.GET("/logout", user.Logout)
		userGroup.GET("/current", user.CurrentUser)
	}
	{
		rGroup := apiv1Router.Group("/grpc")
		rGroup.POST("/command", gApi.SendCommand)
		rGroup.GET("/conn/count", gApi.AgentCount)
		rGroup.GET("/conn/stat", gApi.AgentStat)
		rGroup.GET("/conn/basic", gApi.AgentBasic)
	}
	{
		gGroup := apiv1Router.Group("/plugin")
		gGroup.GET("/list", plugin.PluginList)
		gGroup.POST("/insert", plugin.PluginInsert)
		gGroup.POST("/update", plugin.PluginUpdate)
		gGroup.GET("/select", plugin.PluginSelect)
		gGroup.GET("/delete", plugin.PluginDel)
		gGroup.POST("/send", plugin.SendPlugin)
	}
	{
		aGroup := apiv1Router.Group("/asset")
		aGroup.GET("/get", host.AgentAsset)
	}

	router.Use(Cors())
	router.Run(fmt.Sprintf(":%d", port))
}
