//@ts-ignore
const { appWindow, currentMonitor, LogicalSize, LogicalPosition } = window.__TAURI__.window;

export const snapToSidePosition = async () => {
  const monitor = await currentMonitor();

  const monitorDimensions = monitor.size;

  const newWidth = 300;
  const newYPosition = 103;
  const newHeight = monitorDimensions.height - newYPosition - 29;
  const newXPosition = monitorDimensions.width - newWidth;

  appWindow.setSize(new LogicalSize(newWidth, newHeight));
  appWindow.setPosition(new LogicalPosition(newXPosition, newYPosition));
}