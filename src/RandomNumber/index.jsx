/*
 * PageName: 随机验证码组件
 * Description: 
 */
import React, { useEffect, useRef, useImperativeHandle } from 'react';

function RandomNumber({ state, changeRadomNumber, refs }) {
    const canvasRef = useRef();
    const stateData = {
        codeLength: 4,// 长度
        fontSizeMin: 17,// 文字大小最小范围
        fontSizeMax: 21,// 文字大小最大范围
        backgroundColorMin: 100,// 背景颜色范围
        backgroundColorMax: 200,// 背景颜色范围
        colorMin: 10,// 颜色范围
        colorMax: 100,// 颜色范围
        lineCount: 4,// 干扰线条数
        lineColorMin: 10,// 干扰线颜色范围
        lineColorMax: 180,// 干扰线颜色范围
        dotCount: 20,// 干扰点个数
        dotColorMin: 60,// 干扰点颜色范围
        dotColorMax: 140,// 干扰点颜色范围
        contentWidth: 100,// 宽
        contentHeight: 40,// 高
        isNumber: true,// 纯数字
        ...state,
    };
    // 外层通过 form 调用 reloadPic 刷新验证码
    useImperativeHandle(refs, () => ({
        reloadPic,
    }));

    useEffect(() => {
        drawPic();
    }, []);
    function reloadPic() {
        drawPic();
    }
    function drawPic() {
        randomCode();
    }
    function randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    function randomCode() {
        const isNumber = stateData.isNumber;
        let random = "";
        const str = isNumber
            ? "1234567890"
            : "QWERTYUPLKJHGFDSAZXCVBNMqwertyupkjhgfdsazxcvbnm1234567890";// 去掉了I l i o O,可自行添加
        for (let i = 0; i < stateData.codeLength; i++) {
            const index = Math.floor(Math.random() * (isNumber ? 10 : 57));
            random += str[index];
        }
        changeRadomNumber(random);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.textBaseline = "bottom";
        // 绘制背景
        ctx.fillStyle = randomColor(
            stateData.backgroundColorMin,
            stateData.backgroundColorMax,
        );
        ctx.fillRect(0, 0, stateData.contentWidth, stateData.contentHeight);
        // 绘制文字
        for (let i = 0; i < random.length; i++) {
            drawText(ctx, random[i], i, random);
        }
        drawLine(ctx);
        drawDot(ctx);
    }
    function randomColor(min, max) {
        const r = randomNum(min, max);
        const g = randomNum(min, max);
        const b = randomNum(min, max);
        return `rgb(${r}, ${g}, ${b})`;
    }
    function drawLine(ctx) {
        // 绘制干扰线
        for (let i = 0; i < stateData.lineCount; i++) {
            ctx.strokeStyle = randomColor(
                stateData.lineColorMin,
                stateData.lineColorMax,
            );
            ctx.beginPath();
            ctx.moveTo(
                randomNum(0, stateData.contentWidth),
                randomNum(0, stateData.contentHeight),
            );
            ctx.lineTo(
                randomNum(0, stateData.contentWidth),
                randomNum(0, stateData.contentHeight),
            );
            ctx.stroke();
        }
    }
    function drawDot(ctx) {
        // 绘制干扰点
        for (let i = 0; i < stateData.dotCount; i++) {
            ctx.fillStyle = randomColor(stateData.dotColorMin,
                stateData.docColorMax);
            ctx.beginPath();
            ctx.arc(
                randomNum(0, stateData.contentWidth),
                randomNum(0, stateData.contentHeight),
                1,
                0,
                2 * Math.PI,
            );
            ctx.fill();
        }
    }
    function drawText(ctx, txt, i, code) {
        ctx.fillStyle = randomColor(stateData.colorMin, stateData.colorMax);
        const fontSize = randomNum(
            stateData.fontSizeMin,
            stateData.fontSizeMax,
        );
        ctx.font = `${fontSize}px arial`;
        const padding = 10;
        const offset =
            (stateData.contentWidth - 40) / (code.length - 1);
        let x = padding;
        if (i > 0) {
            x = padding + i * offset;
        }
        let y = randomNum(
            stateData.fontSizeMax,
            stateData.contentHeight - 5,
        );
        if (fontSize > 40) {
            y = 40;
        }
        const deg = randomNum(-10, 10);
        // 修改坐标原点和旋转角度
        ctx.translate(x, y);
        ctx.rotate((deg * Math.PI) / 180);
        ctx.fillText(txt, 0, 0);
        // 恢复坐标原点和旋转角度
        ctx.rotate((-deg * Math.PI) / 180);
        ctx.translate(-x, -y);
    }
    return (
        < >
            <canvas
                onClick={reloadPic}
                ref={canvasRef}
                width={stateData.contentWidth}
                height={stateData.contentHeight}
            />
        </ >
    );
}

export default RandomNumber