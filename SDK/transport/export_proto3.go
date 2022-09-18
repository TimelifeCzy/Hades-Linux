package main

import (
	"bufio"
	"encoding/binary"
	"fmt"
	"io"
	"os"
	"strconv"
	"time"

	"github.com/chriskaliX/SDK/transport/protocol"
)

func main() {
	// 编译x32的设置GOARCH=386 & binaryPath := "HadesSvc.exe"
	binaryPath := "HadesSvc64.exe"
	args := []string{""}

	ppReader, ppWriter, Stderr := os.Pipe()
	if Stderr != nil {
		fmt.Printf("create cmd stdoutpipe failed,error:%s\n", Stderr)
		os.Exit(1)
	}
	defer ppWriter.Close()
	defer ppReader.Close()

	ppReader1, ppWriter1, Stderr := os.Pipe()
	if Stderr != nil {
		fmt.Printf("create cmd stdoutpipe failed,error:%s\n", Stderr)
		os.Exit(1)
	}
	defer ppReader1.Close()
	defer ppWriter1.Close()

	bufio.NewReaderSize(ppReader, 1024*1024)
	bufio.NewWriterSize(ppWriter1, 512*1024)

	procAttr := new(os.ProcAttr)
	procAttr.Files = []*os.File{ppReader, ppWriter1, os.Stderr}
	pros, err := os.StartProcess(binaryPath, args, procAttr)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("son ", pros.Pid)
	time.Sleep(5 * time.Second)

	// 内核采集开启
	task := &protocol.Task{
		DataType:   403,
		ObjectName: "",
		Data:       "",
		Token:      "",
	}
	size := task.Size()
	var buf = make([]byte, 4+size)
	if _, err = task.MarshalToSizedBuffer(buf[4:]); err != nil {
		return
	}
	binary.LittleEndian.PutUint32(buf[:4], uint32(size))
	_, err = ppWriter.Write(buf)

	// Etw开启
	var buf1 = make([]byte, 4+size)
	task.DataType = 401
	if _, err = task.MarshalToSizedBuffer(buf1[4:]); err != nil {
		return
	}
	binary.LittleEndian.PutUint32(buf1[:4], uint32(size))
	_, err = ppWriter.Write(buf1)

	time.Sleep(10 * time.Second)

	// Etw关闭
	var buf2 = make([]byte, 4+size)
	task.DataType = 402
	if _, err = task.MarshalToSizedBuffer(buf2[4:]); err != nil {
		return
	}
	binary.LittleEndian.PutUint32(buf2[:4], uint32(size))
	_, err = ppWriter.Write(buf2)

	// 内核采集关闭
	var buf3 = make([]byte, 4+size)
	task.DataType = 404
	if _, err = task.MarshalToSizedBuffer(buf3[4:]); err != nil {
		return
	}
	binary.LittleEndian.PutUint32(buf3[:4], uint32(size))
	_, err = ppWriter.Write(buf3)

	// 等待读管道
	var buffer []byte = make([]byte, 4096)
	for {
		n, err := ppReader1.Read(buffer)
		if err != nil {
			if err == io.EOF {
				fmt.Printf("pipi has Closed\n")
				break
			} else {
				fmt.Println("Read content failed")
			}
		}
		fmt.Print(string(buffer[:n]))
	}

}

//export testPackteDeCode
func testPackteDeCode(data string, taskid int32, protobuf *string) (err error) {
	record := &protocol.Record{
		DataType:  taskid,
		Timestamp: time.Now().Unix(),
		Data: &protocol.Payload{
			Fields: map[string]string{
				"data_type": strconv.Itoa(int(taskid)),
				"udata":     data,
			},
		}}
	var buf []byte
	buf, err = record.Marshal()
	if err != nil {
		return err
	}
	*protobuf = string(buf[:])
	return err
}
