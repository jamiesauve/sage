export const isSafariOniOS = (): boolean => {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)

  console.log({ isSafari, isIOS})

  return (isSafari && isIOS)
}