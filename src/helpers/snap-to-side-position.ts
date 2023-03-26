//@ts-ignore
const { appWindow, currentMonitor, LogicalSize, LogicalPosition } = window.__TAURI__.window;

export const snapToSidePosition = async () => {
  const monitor = await currentMonitor();

  const monitorDimensions = monitor.size;

  // these values have been set based on the apps I use most often - change them to reposition/resize the app
  const TOP_TOOLBAR_HEIGHT = 103;
  const BOTTOM_TOOLBAR_HEIGHT = 29;
  const DEFAUT_APP_WIDTH = 300;
  const SCROLLING_AREA_WIDTH = 17;

  const newWidth = DEFAUT_APP_WIDTH;
  const newYPosition = TOP_TOOLBAR_HEIGHT;
  const newHeight = monitorDimensions.height - newYPosition - BOTTOM_TOOLBAR_HEIGHT;
  const newXPosition = monitorDimensions.width - newWidth - SCROLLING_AREA_WIDTH;

  appWindow.setSize(new LogicalSize(newWidth, newHeight));
  appWindow.setPosition(new LogicalPosition(newXPosition, newYPosition));
}