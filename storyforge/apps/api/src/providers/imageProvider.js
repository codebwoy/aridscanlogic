/**
 * ImageProvider interface — swap vendors without changing routes.
 * Implementations must never receive API keys from the client.
 */

export class ImageProvider {
  async generateCharacterSheet(_input) {
    throw new Error('Not implemented')
  }
  async generateScene(_input) {
    throw new Error('Not implemented')
  }
  async generateTwoCharacterScene(_input) {
    throw new Error('Not implemented')
  }
  async photoToCartoon(_input) {
    throw new Error('Not implemented')
  }
  async edit(_input) {
    throw new Error('Not implemented')
  }
  async inpaint(_input) {
    throw new Error('Not implemented')
  }
  async outpaint(_input) {
    throw new Error('Not implemented')
  }
  async upscale(_input) {
    throw new Error('Not implemented')
  }
  /** Image-to-video from an approved still (pinned scene / page). */
  async generateVideo(_input) {
    throw new Error('Not implemented')
  }
  async removeBackground(_input) {
    throw new Error('Not implemented')
  }
  async embed(_input) {
    throw new Error('Not implemented')
  }
}
